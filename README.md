# 🎥 StreamSummarizer — RAG-Powered YouTube Video Summarizer

StreamSummarizer transforms long YouTube videos into **concise, context-rich summaries** using a fully local **Retrieval Augmented Generation (RAG)** pipeline.  
Unlike typical full-stack projects, this system focuses heavily on **RAG architecture, vector search, embeddings, and LLM reasoning.**

---

## 🚀 How It Works

1. User submits a **YouTube link**  
2. **Qdrant Vector DB** checks if the transcript already exists  
3. If transcript exists → retrieved directly  
4. If not → **BrightData scraper** extracts the transcript automatically  
5. Transcript is **chunked and embedded locally** using **Xenova CPU embeddings**  
6. **Anthropic Claude-3** generates a context-aware summary using retrieved chunks  

---

## 🛠 Tech Stack

### **Backend**
- Node.js, Express.js  
- Qdrant (Vector Database)  
- Xenova (Local CPU-based embeddings — zero API cost)  
- BrightData (YouTube transcript scraping)

### **LLM**
- **Anthropic Claude-3** for summarization, reasoning & contextual Q&A  

### **Frontend**
- React  
- Chat-style UI with threaded conversations  
- Real-time streaming responses

---

## ✨ Key Features

- 🔍 **Retrieval Augmented Generation (RAG)** pipeline  
- ✂️ Automatic transcript scraping → chunking → embedding → vector storage  
- 🤖 Local embeddings using **Xenova** (CPU-only, fast & free)  
- 🧠 High-quality summaries powered by **Claude-3**  
- 🧵 Maintains context with threaded conversations  
- 🎯 Fast semantic search using **Qdrant**  
- 💸 Fully cost-efficient — minimal external API usage  

---

## 📌 Live Demo & Source Code

🌐 **Live**: https://lnkd.in/e3zpvg-7  
💻 **GitHub**: https://lnkd.in/eH_Ki9UQ  

---

## 📦 Installation

```bash
git clone <your-repo-url>
cd StreamSummarizer
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=streamsummarizer
BRIGHTDATA_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
PORT=5000
```

---

## ▶️ Running the Project

```bash
npm start
```

The server will start on:

```
http://localhost:5000
```

Open the React client (if separate):

```bash
npm run dev
```

---

## 🧪 RAG Flow (Internal Architecture)

```
YouTube URL → Check transcript in Qdrant  
          ↳ (No) → Scrape via BrightData  
          ↳ Chunk text → Embed with Xenova  
          ↳ Store embeddings in Qdrant  
          ↓  
Retrieve relevant chunks → Send to Claude-3 → Generate summary  
```

---

## 🤝 Contributing

Pull requests are welcome!  
Feel free to open an issue for feature requests or bugs.

---

## 📜 License

MIT License © 2025
