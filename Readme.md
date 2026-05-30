<div align="center">
  <img src="https://raw.githubusercontent.com/Yuvakunaal/AI-Flowchart-Studio/main/frontend/favicon.svg" alt="AI Flowchart Studio Logo" width="120" />

# AI Flowchart Studio — AI Flowchart Generator from Text

**Generate Flowcharts, Workflow Diagrams & System Design Diagrams with Gemini AI**

Turn natural language prompts into editable flowcharts using Google's Gemini AI. Create workflow diagrams, system design visualizations, Mermaid diagrams, and process maps without starting from a blank canvas.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Access_Now-6366f1?style=for-the-badge)](https://ai-flowchart-studio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Yuvakunaal/AI-Flowchart-Studio)

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Diagram Types](#diagram-types)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Use Cases](#use-cases)
- [Security & Privacy](#security--privacy)
- [SEO & Discoverability](#seo--discoverability)
- [Tech Stack](#tech-stack)

---

## 🌟 Live Application

**[Try the AI Flowchart Generator Now](https://ai-flowchart-studio.vercel.app)**

AI Flowchart Studio is a production-ready, fully deployed web application that generates diagrams from natural language prompts using Gemini AI.

> **Note:** Uses BYOK (Bring Your Own Key) architecture. A free Google Gemini API key is required for AI generation. Your key is saved locally in your browser and is only transmitted during generation so the backend can relay the request to Gemini; it is not stored by the app server.

---

## 📖 Overview

**AI Flowchart Studio** is an AI flowchart generator from text that transforms natural language descriptions into structured diagrams. It combines a **Multi-Agent Orchestration** backend with a modern **Glassmorphic UI** to provide seamless AI-driven and manual diagram creation.

This tool is designed for teams that need to generate workflow diagrams, system design diagrams, and flowcharts without the overhead of manual drawing or learning specialized syntax.

## ✨ Key Features

### AI-Powered Diagram Generation

- **🤖 Gemini AI Integration**: Multi-Agent Orchestration powered by Google's latest Gemini models ensures logical accuracy and syntactic validity for flowchart generation.
- **Text to Flowchart Generation**: Describe your flowchart, workflow, process map, or system architecture in plain English and get a rendered diagram in seconds.
- **Intelligent Structure**: The AI analyzes intent, decomposes logic, generates optimized diagram code, and validates output—all automatically.

### Diagram Editing & Management

- **🔄 Undo/Redo Engine**: Sophisticated state management tracks all changes across AI generations and manual edits with a 50-step history buffer.
- **✏️ Precision Manual Builder**: Click & Type interface for adding nodes, creating links, and editing shapes without any coding knowledge.
- **📁 Multi-Project Management**: Save, load, and manage up to 5 concurrent projects locally with instant access.

### Export & Output Flexibility

- **💎 Multi-Format Export**:
  - PNG (3x Super-Scaled, high-quality vector rendering)
  - SVG (infinitely scalable for design and print)
  - Mermaid Code (for version control and documentation)
- **🎨 Theme Support**: Dark, Light, Forest, and Neutral themes for different documentation styles.
- **🌍 Layout Options**: Top-Down and Left-to-Right orientations for different diagram styles.

### User Experience

- **📱 Mobile-First**: Responsive design with native Bottom-Sheet menus for seamless mobile diagramming.
- **🔍 Smart Canvas**: Hardware-accelerated zoom (0.2x to 3x) with intuitive pan controls.
- **⚡ Real-Time Feedback**: Server-Sent Events (SSE) pipeline status streaming during AI generation.
- **🛡️ Privacy First**: 100% local key storage in browser; zero data retention on servers.

---

## 📊 Diagram Types

This AI flowchart generator supports multiple diagram styles for different use cases:

### Flowcharts

Generate structured flowcharts with decision branches, process steps, and outcomes. Perfect for:

- User authentication flows
- Feature decision trees
- Troubleshooting guides
- Business logic representation

### Workflow Diagrams

Create workflow diagrams for operational processes:

- Employee onboarding and offboarding
- Approval and escalation paths
- Content review and publishing
- Support ticket routing

### System Design Diagrams

Design system architecture and technical diagrams:

- Service-to-service architecture
- Data flow and dependencies
- Infrastructure overviews
- Microservice interactions

---

## 🚀 Getting Started

### Try Online (No Setup Required)

**[Visit AI Flowchart Studio](https://ai-flowchart-studio.vercel.app)** and start generating flowcharts instantly.

### Prerequisites

- Google Gemini API key (free tier available at [Google AI Studio](https://aistudio.google.com/app/apikey))
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. Open the live app
2. Get your free Gemini API key
3. Enter the key in app settings (stored locally)
4. Describe your flowchart in plain English
5. Click "Generate Flowchart" and wait for AI to build it
6. Edit manually if needed and export

### Helpful Pages

- **[AI Flowchart Generator from Text](https://ai-flowchart-studio.vercel.app)**: Main app and primary generator.
- **[Gemini AI Flowchart Generator](https://ai-flowchart-studio.vercel.app/gemini-ai-flowchart-generator/)**: Guide for prompt-based Gemini flowchart generation.
- **[Workflow Diagram Generator](https://ai-flowchart-studio.vercel.app/workflow-diagram-generator/)**: Workflow and process mapping use cases.
- **[AI System Design Diagram Generator](https://ai-flowchart-studio.vercel.app/ai-system-design-generator/)**: Architecture and service dependency diagram use cases.
- **[Documentation](https://ai-flowchart-studio.vercel.app/docs.html)**: Setup, prompt writing, manual editing, canvas controls, and export guide.

---

## 🏗️ Architecture

### Multi-Agent AI Pipeline

The core differentiator is a **4-stage intelligent pipeline** that ensures high-quality diagram generation:

1. **Orchestrator Agent**: Analyzes user intent and validates if the prompt can logically be visualized as a flowchart.
2. **Logic Parser Agent**: Decomposes the raw text into a highly structured JSON graph containing strict Nodes and Edges.
3. **Generator Agent**: Converts the validated logical graph into highly optimized Mermaid.js syntax.
4. **Syntax Validator**: Performs a final safety check to catch rendering anomalies and guarantee a perfect visual output.

### Tech Stack

| Component            | Technology                                             |
| -------------------- | ------------------------------------------------------ |
| **Frontend**         | ES6+ JavaScript, Vanilla CSS3, Mermaid.js, html2canvas |
| **Backend**          | FastAPI (Python), Google Gemini AI SDK                 |
| **Frontend Hosting** | Vercel (CDN)                                           |
| **Backend Hosting**  | Render (ASGI/Gunicorn)                                 |
| **Architecture**     | RESTful API + Server-Sent Events (SSE)                 |
| **UI Design**        | Glassmorphism, Dark/Light Themes                       |
| **Storage**          | Browser LocalStorage (zero server retention)           |

---

## 📈 Use Cases

### For Software Engineers

- **System Design Diagrams**: Visualize microservice architecture, dependencies, and data flow
- **User Authentication Flows**: Map login, signup, and password recovery processes
- **API Integration Diagrams**: Show third-party integrations and data movements

### For Product & Business Teams

- **Workflow Diagrams**: Document employee onboarding, approvals, and operational processes
- **User Journey Maps**: Visualize customer paths and decision points
- **Feature Decision Trees**: Map A/B testing logic and feature rollout conditions

### For Operations & Support

- **Troubleshooting Guides**: Create visual decision trees for common issues
- **Incident Response Flows**: Map escalation paths and resolution steps
- **Process Documentation**: Generate approval workflows and handoff procedures

### For Education & Documentation

- **Algorithm Flowcharts**: Teach programming concepts visually
- **Business Process Mapping**: Document organizational procedures
- **Technical Architecture**: Communicate system design to stakeholders

---

## 🛡️ Security & Privacy (BYOK)

We believe your logic is your intellectual property. AI Flowchart Studio implements a strict **Bring Your Own Key (BYOK)** policy:

- **Zero Server Retention**: Saved projects and API key settings live in browser `LocalStorage`. During generation, prompts and API keys are transmitted only for the active request and are not retained by the app server.
- **Generation-Time Transit Only**: During AI generation, the prompt and selected API key are sent to the Render backend so it can call Google's Gemini API. The backend does not persist the key, prompt, or generated diagram.
- **Direct Proxy Architecture**: The Render backend acts as a request relay to Google's Gemini API and streams progress back to the browser.
- **Minimal Analytics**: The frontend includes Vercel Web Analytics for aggregate site usage. Diagram content, API keys, and saved projects are not used for profiling.
- **Open Source**: Full codebase available for security audits and transparency.

---

## 🌐 SEO & Discoverability

This AI flowchart generator is optimized for search engines and designed to help users find the right diagramming workflow quickly:

- **Primary Keywords**: AI flowchart generator from text, Gemini AI flowchart generator, Mermaid diagram generator, workflow diagram generator, AI system design diagram generator
- **Sitemap**: [XML Sitemap](https://ai-flowchart-studio.vercel.app/sitemap.xml)
- **Robots**: [robots.txt](https://ai-flowchart-studio.vercel.app/robots.txt)
- **Structured Metadata**: Key pages include titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, and JSON-LD schema.
- **Indexable Pages**:
  - [AI Flowchart Generator from Text](https://ai-flowchart-studio.vercel.app)
  - [Gemini AI Flowchart Generator](https://ai-flowchart-studio.vercel.app/gemini-ai-flowchart-generator/)
  - [AI System Design Diagram Generator](https://ai-flowchart-studio.vercel.app/ai-system-design-generator/)
  - [Workflow Diagram Generator](https://ai-flowchart-studio.vercel.app/workflow-diagram-generator/)
  - [Documentation](https://ai-flowchart-studio.vercel.app/docs.html)
- **404 Protection**: Vercel rewrites explicitly support the key SEO pages with and without trailing slashes, plus `/docs`, `/robots.txt`, and `/sitemap.xml`.

---

## 📝 License

This project is open source. Check LICENSE file for details.

---

## 🤝 Contributing

Contributions welcome! Feel free to submit PRs for bug fixes, features, or documentation improvements.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Yuvakunaal/AI-Flowchart-Studio/issues)
- **Live App**: [ai-flowchart-studio.vercel.app](https://ai-flowchart-studio.vercel.app)
- **Author**: [Kunaal](https://www.linkedin.com/in/boggavarapu-yuva-satya-kunaal-127817290/)

---

<div align="center">
  <strong>AI Flowchart Studio</strong> — Generate flowcharts, workflow diagrams & system design with Gemini AI
  
  <i>Built for intelligent, frictionless diagramming.</i>
</div>
