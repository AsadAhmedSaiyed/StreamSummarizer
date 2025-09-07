# 🚀 StreamSummarizer: RAG-powered YouTube Video Summarizer

**StreamSummarizer** leverages **Retrieval-Augmented Generation (RAG)** to transform long YouTube videos into concise, context-rich summaries. This project is **RAG-focused**, moving beyond typical frontend/backend concerns.

---

## 💡 Overview

Sick of sitting through long videos? StreamSummarizer enables:

- Automatic transcript retrieval and scraping
- Local embedding of text chunks using **Xenova** on CPU
- Context-aware summaries using **Anthropic (Claude-3) LLM**
- Threaded conversations in a React chat interface

It demonstrates a practical **RAG system**, combining **retrieval, local embeddings, and LLM reasoning**.

---

## 🛠 Tech Stack

- **Backend:** Express.js, Node.js  
- **Vector Database:** Qdrant for semantic search and filtering  
- **Embeddings:** Xenova transformer (CPU-based, local)  
- **LLM:** Anthropic (Claude-3) for reasoning & summarization (does not parse URLs)  
- **Frontend:** React chat interface with threaded conversations and real-time updates  
- **Scraping:** BrightData for YouTube transcript scraping  

---

## ✨ Key Features

- **RAG system:** Retrieval + generation ensures accurate, context-rich summaries  
- Threaded conversations maintain context across multiple queries  
- Automatic transcript scraping and vectorization  
- Local CPU-based embeddings—no external API needed  
- Moving beyond MERN: focuses on **RAG features**, not traditional frontend/backend  

---

## 💻 How It Works

1. User provides a YouTube link.  
2. **Qdrant vector database** checks if transcript exists.  
3. Transcript exists → retrieve; otherwise → scrape via **BrightData**.  
4. Transcript is split into meaningful chunks and embedded locally with **Xenova**.  
5. **Anthropic (Claude-3) LLM** generates a concise, context-aware summary using retrieved chunks.

---

### Deployement link

1. Frontend : https://stream-summarizer.vercel.app/
2. Backend : https://streamsummarizer-1.onrender.com

---

## 🗂 Project Structure

streamsummarizer/
├─ backend/
│ ├─ agent.js # Agent setup with LLM and tools
│ ├─ vectorStore.js # Qdrant integration, embeddings, similarity search
│ ├─ brightdata.js # YouTube scraping trigger
│ ├─ server.js # Express server
│ ├─ package.json
│ └─ .env
├─ frontend/
│ ├─ src/
│ │ ├─ App.jsx # Chat interface
│ │ ├─ index.css
│ │ └─ main.jsx
│ ├─ package.json
├─ data.js # Sample videos & transcripts for testing
├─ README.md
└─ .gitignore

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18  
- npm or yarn  
- Qdrant account / API key  
- BrightData account / API key  
- Anthropic API key  

### Installation


# Clone the repository
git clone https://github.com/yourusername/streamsummarizer.git
cd streamsummarizer

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

### Environment Variables

PORT=3000
QDRANT_URL=<your-qdrant-url>
QDRANT_API_KEY=<your-qdrant-api-key>
BRIGHTDATA_API_KEY=<your-brightdata-api-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>

### Running project

# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
