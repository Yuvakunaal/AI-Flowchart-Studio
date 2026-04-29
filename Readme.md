<div align="center">
  <img src="https://raw.githubusercontent.com/Yuvakunaal/AI-Flowchart-Studio/main/frontend/favicon.svg" alt="AI Flowchart Studio Logo" width="120" />

  # 🚀 AI Flowchart Studio
  
  **Enterprise-Grade Natural Language to Visual Logic Generator**

  [![Live Demo](https://img.shields.io/badge/Live_Demo-Access_Now-6366f1?style=for-the-badge)](https://ai-flowchart-studio.vercel.app)
  
  ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
  ![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 🌟 Live Application

AI Flowchart Studio is a fully deployed, real-time web application. 
**[Experience the live application here!](https://ai-flowchart-studio.vercel.app)**

*Note: The application utilizes a "Bring Your Own Key" (BYOK) architecture. You will need a free Google Gemini API key to utilize the AI generation features. Your key is stored 100% locally in your browser and never leaves your machine.*

---

## 📖 Overview

AI Flowchart Studio is a high-performance, production-ready web application that transforms complex natural language descriptions into professional, structured flowcharts. Built with a sophisticated **Multi-Agent Orchestration** backend and a premium **Glassmorphic UI**, it offers a seamless experience for both AI-driven generation and manual precision diagramming.

## ✨ Key Features

- **🤖 Multi-Agent AI Generator**: Powered by Google's Gemini models, the system uses an Orchestrator-Parser-Generator architecture to guarantee logical accuracy and syntax validity.
- **🛠️ Precision Manual Builder**: A complete "Click & Type" interface for manual refinement, allowing you to seamlessly add nodes, link connections, and edit custom shapes with zero coding required.
- **💎 Ultra-HD Pro Export**: 
    - **PNG**: 3x Super-Scaled, crystal-clear captures using native SVG geometry.
    - **SVG**: Infinitely scalable vector format for high-end print, presentations, and graphic design.
    - **Code**: Direct access to Mermaid.js syntax for version control and documentation.
- **🔍 Smart Canvas Engine**: Hardware-accelerated scaling (+/- 300%) with intuitive panning and zoom controls.
- **🎭 Intelligent Themes**: Dynamic switching between Dark, Light, and Forest aesthetic themes.
- **🌍 Layout Versatility**: Instant toggle between Vertical (Top-Down) and Horizontal (Left-to-Right) flowchart orientations.

---

## 🏗️ The Multi-Agent Engine

The core of the backend is a sophisticated 4-stage pipeline that ensures "Garbage In" never becomes "Garbage Out". By splitting the workload across multiple specialized agents, the application achieves near 100% syntactical success:

1.  **Orchestrator Agent**: Analyzes user intent and validates if the prompt can logically be visualized as a flowchart.
2.  **Logic Parser Agent**: Decomposes the raw text into a highly structured JSON graph containing strict Nodes and Edges.
3.  **Generator Agent**: Converts the validated logical graph into highly optimized Mermaid.js syntax.
4.  **Syntax Validator**: Performs a final safety check to catch rendering anomalies and guarantee a perfect visual output.

---

## 🛠️ Technical Architecture

- **Frontend Deployment**: [Vercel](https://vercel.com) (Static CDN)
- **Backend Deployment**: [Render](https://render.com) (ASGI/Gunicorn Python Workers)
- **Frontend Stack**: ES6+ JavaScript, Native DOM APIs, Mermaid.js, html2canvas.
- **Backend Stack**: FastAPI (Python), Google GenAI SDK.
- **Styling**: Vanilla CSS3 with Custom Properties and a Glassmorphism design system.
- **Data Flow**: RESTful API with Server-Sent Events (SSE) for real-time AI pipeline status streaming.

---

## 💻 Local Development Setup

If you wish to run the project locally for development or contributions:

### 1. Clone the Repository
```bash
git clone https://github.com/Yuvakunaal/AI-Flowchart-Studio.git
cd AI-Flowchart-Studio
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory:
```env
GEMINI_API_KEY="your_optional_fallback_key"
FRONTEND_URL="*"
```

### 4. Run the Servers
Start the FastAPI backend:
```bash
uvicorn main:app --reload
```
Then, open `frontend/index.html` in your browser (or use an extension like VS Code Live Server).

---
<div align="center">
  <i>Built for intelligent, frictionless diagramming.</i>
</div>
