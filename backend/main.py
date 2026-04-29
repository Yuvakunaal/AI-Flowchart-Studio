from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import asyncio
import os
from dotenv import load_dotenv

from agents import orchestrator_agent, logic_parser_agent, flowchart_gen_agent, validator_agent

load_dotenv()

app = FastAPI(title="NL Flowchart Multi-Agent System")

frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
async def generate_flowchart(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    user_api_key = request.headers.get("X-Gemini-API-Key")
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    async def event_generator():
        try:
            # Stage 1: Orchestration
            yield f"data: {json.dumps({'status': 'Analyzing request...'})}\n\n"
            orchestration = await orchestrator_agent(prompt, api_key=user_api_key)
            
            if not orchestration.get("valid"):
                yield f"data: {json.dumps({'error': orchestration.get('message')})}\n\n"
                return

            # Stage 2: Logic Parsing
            yield f"data: {json.dumps({'status': 'Extracting logical structure...'})}\n\n"
            logic = await logic_parser_agent(prompt, api_key=user_api_key)
            
            # Stage 3: Code Generation
            yield f"data: {json.dumps({'status': 'Generating Mermaid syntax...'})}\n\n"
            mermaid_code = await flowchart_gen_agent(logic, api_key=user_api_key)
            
            # Stage 4: Validation
            yield f"data: {json.dumps({'status': 'Validating syntax...'})}\n\n"
            validated_code = await validator_agent(mermaid_code, api_key=user_api_key)
            
            # Success
            yield f"data: {json.dumps({'status': 'Flowchart rendered successfully!'})}\n\n"
            yield f"data: {json.dumps({'result': validated_code, 'logic': logic.model_dump()})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
