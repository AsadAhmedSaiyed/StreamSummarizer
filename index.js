import express from "express";
import cors from "cors";
import { agent } from "./agent.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello world");
});

app.post("/generate",async (req,res)=>{
    const {query, video_id,thread_id} = req.body;
    


console.log("Q1-------");
const result = await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
  },
  {
    configurable: { thread_id, video_id },
  }
);

console.log(result.messages.at(-1).content);

res.send(result.messages.at(-1).content);

});

app.listen(port,()=>{
  console.log("Server started!");
});