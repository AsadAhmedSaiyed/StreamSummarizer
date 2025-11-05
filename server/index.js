import express from "express";
import cors from "cors";
import { agent } from "./agent.js";
import "dotenv/config";
import { addYTVideoToVectorStore } from "./vectorStore.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json({limit : '200mb'}));
app.use(
  cors({
    origin: ["https://stream-summarizer.vercel.app","http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/generate", async (req, res) => {
  const { query, thread_id } = req.body;
  const result = await agent.invoke(
    {
      messages: [{ role: "user", content: query }],
    },
    { configurable: { thread_id} }
  );

  console.log(result.messages.at(-1)?.content);
  res.send(result.messages.at(-1)?.content);
});

app.post("/webhook", async (req, res) => {
  console.log(req.body);

  await Promise.all(
    req.body.map(async (video) => addYTVideoToVectorStore(video))
  );

  console.log("Video added");

  res.send("OK");
});

app.listen(port, () => {
  console.log("Server started!");
});
