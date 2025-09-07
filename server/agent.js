import "dotenv/config";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import data from "./data.js";
import { tool } from "@langchain/core/tools";
import z from "zod";
import { MemorySaver } from "@langchain/langgraph";
import {
  addYTVideoToVectorStore,
  similaritySearch,
  initVectorStore,
} from "./vectorStore.js";


//init vector store once
await initVectorStore();


//step1 - indexing
//1)loaded data
const vid1 = data[1];
const vid2 = data[0];


// console.log("adding");

//await addYTVideoToVectorStore(vid1);

 //await addYTVideoToVectorStore(vid2);


//step2 - Retrieve and Generate

//retrieval tool - think a it a custom button that agent can press to perform a specific task
const retrieveTool = tool(
  async ({ query }, { configurable: { video_id } }) => {
    try {
      //retrieve the most relevant chunks
      const retrievedDocs = await similaritySearch(query, 5, video_id);
    
      //merging docs
      const serializeDocs = retrievedDocs
        .map((doc) => doc.content)
        .join("\n\n");
      return serializeDocs;
    } catch (e) {
      console.error("Retrieval tool failed:", e);
      return "I'm having a technical issue with retrieving documents.";
    }
  },
  {
    //metadata
    name: "retrieve",
    description:
      "Retrieve the most relevant chunks of text from the transcript of a youtube video",
    //input schema
    schema: z.object({
      query: z.string(),
    }),
  }
);

const llm = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  apiKey: process.env.ANTHROPIC_API_KEY,
});

//obj where memory is saved
const checkpointer = new MemorySaver();

export const agent = createReactAgent({
  llm,
  tools: [retrieveTool],
  checkpointer,
});


