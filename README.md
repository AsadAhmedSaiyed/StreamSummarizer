# 🚀 StreamSummarizer: RAG-powered YouTube Video Summarizer

Sick of long YouTube videos? **StreamSummarizer** leverages **Retrieval-Augmented Generation (RAG)** to deliver concise, context-rich summaries—fast.  

This project is focused on **RAG features**, moving beyond traditional frontend/backend concerns, demonstrating retrieval, local embeddings, and LLM reasoning in action.

---

## 💡 How It Works

- Share a YouTube link.  

- **Qdrant vector database** checks if the transcript exists.  

- Transcript found → retrieve; if not → scrape automatically via **BrightData**.  

- Text is split into chunks and **embedded locally using Xenova** (CPU-based embeddings).  

- **Anthropic (Claude-3) LLM** generates a clear, context-aware summary from the retrieved chunks.  

---

## 🛠 Tech Stack

- **Backend:** Express.js, Node.js  

- **Vector Database:** Qdrant for semantic search  

- **Embeddings:** Xenova running **locally on CPU**  

- **LLM:** Anthropic (Claude-3) for reasoning & summarization; does not parse URLs  

- **Frontend:** React chat interface with threading & live updates  

---

## ✨ Key Features

- **RAG system:** Combines retrieval + generation for accurate, context-rich summaries  

- Maintains context through threaded conversations  

- Automatic transcript scraping & vectorization  

- CPU-based embeddings—no external API needed  

- Focused on **RAG capabilities**, moving beyond typical frontend/backend implementations  

---

### Live Demo

1. Frontend: https://stream-summarizer.vercel.app/

2. Backend: https://streamsummarizer-1.onrender.com

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18  

- npm or yarn  

- Qdrant account / API key  

- BrightData account / API key  

- Anthropic API key  

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/streamsummarizer.git
cd streamsummarizer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install


# Start frontend
cd ../frontend
npm run dev
