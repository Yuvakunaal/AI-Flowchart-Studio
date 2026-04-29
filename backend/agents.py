import os
import json
import asyncio
from typing import List, Dict, Optional
from google import genai
from pydantic import BaseModel, Field
from mermaid.flowchart import FlowChart, Node, Link

class EdgeModel(BaseModel):
    source_id: str
    target_id: str
    label: Optional[str] = None

class NodeModel(BaseModel):
    id: str
    label: str
    shape: str = Field(description="Shape type: 'rectangle', 'diamond' (for conditions/decisions), 'round' (for start/end)")

class FlowchartLogic(BaseModel):
    nodes: List[NodeModel]
    edges: List[EdgeModel]

def get_gemini_client(api_key: Optional[str] = None):
    # Use provided key, or fallback to environment variable
    final_key = api_key or os.getenv("GEMINI_API_KEY")
    if not final_key:
        raise ValueError("No Gemini API Key provided. Please set it in Settings or the .env file.")
    return genai.Client(api_key=final_key)

async def orchestrator_agent(prompt: str, api_key: Optional[str] = None) -> dict:
    """Decides if the prompt is valid for flowchart generation."""
    client = get_gemini_client(api_key)
    
    system_prompt = '''You are the Orchestrator for a Flowchart Generator system.
    Evaluate the user's prompt. Is it a request that can be turned into a flowchart?
    Respond with a JSON object: {"valid": true, "message": "Proceeding"} if valid.
    If it's too vague or unrelated, respond with {"valid": false, "message": "Your clarifying question here..."}.'''
    
    response = await client.aio.models.generate_content(
        model='gemini-3-flash-preview',
        contents=f"{system_prompt}\n\nUser prompt: {prompt}",
        config=genai.types.GenerateContentConfig(response_mime_type="application/json")
    )
    return json.loads(response.text)

async def logic_parser_agent(prompt: str, api_key: Optional[str] = None) -> FlowchartLogic:
    """Extracts nodes and edges into structured JSON."""
    client = get_gemini_client(api_key)
    
    system_prompt = '''You are the Logic Parser Agent. 
    Extract the logic from the user prompt into a structured flowchart.
    Identify nodes (steps, decisions) and edges (connections, branches).
    Assign short, unique IDs to nodes (e.g., 'n1', 'step2', 'action_3'). 
    CRITICAL: Never use reserved words like 'start', 'end', 'graph', 'flowchart', 'subgraph' as IDs. Use prefixes like 'node_' if needed.
    Shape options: 'rectangle' (default process), 'diamond' (decision), 'round' (start/end).'''
    
    response = await client.aio.models.generate_content(
        model='gemini-3-flash-preview',
        contents=f"{system_prompt}\n\nUser prompt: {prompt}",
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=FlowchartLogic
        )
    )
    data = json.loads(response.text)
    return FlowchartLogic(**data)

async def flowchart_gen_agent(logic: FlowchartLogic, api_key: Optional[str] = None) -> str:
    """Uses mermaid-py to generate syntax from the structured logic."""
    # This agent doesn't use AI, so api_key is ignored but kept for signature consistency
    nodes_dict = {}
    
    for n in logic.nodes:
        shape = n.shape.lower()
        if shape == 'diamond':
            shape_str = 'rhombus' 
        elif shape == 'round':
            shape_str = 'round-edge' 
        else:
            shape_str = 'normal' 
            
        nodes_dict[n.id] = Node(n.id, n.label, shape=shape_str)
        
    links = []
    for e in logic.edges:
        src = nodes_dict.get(e.source_id)
        tgt = nodes_dict.get(e.target_id)
        if src and tgt:
            if e.label:
                links.append(Link(src, tgt, message=e.label))
            else:
                links.append(Link(src, tgt))
                
    chart = FlowChart("Flowchart", list(nodes_dict.values()), links)
    return chart.script

async def validator_agent(mermaid_code: str, api_key: Optional[str] = None) -> str:
    """Validates the mermaid code."""
    # This agent doesn't use AI, so api_key is ignored but kept for signature consistency
    if not mermaid_code or len(mermaid_code) < 10:
        raise ValueError("Generated flowchart code is suspiciously short or empty.")
    return mermaid_code
