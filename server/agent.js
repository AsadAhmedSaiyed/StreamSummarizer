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
import { triggerYoutubeVideoScrape } from "./brightdata.js";


//init vector store once
await initVectorStore();

//step1 - indexing
//1)loaded data
const vid1 = data[1];
const vid2 = data[0];

// console.log("adding");

//await addYTVideoToVectorStore(vid1);

//await addYTVideoToVectorStore(vid2);

const triggerYoutubeVideoScrapeTool = tool(async ({url})=> {
  console.log("Triggering youtube video scrapping", url);
  const snapshotId = await triggerYoutubeVideoScrape(url);
  console.log("Triggered", snapshotId);
  return snapshotId;
}, {
  name: "triggerYoutubeVideoScrape",
  description: `Trigger the scraping of a youtube video using the url.
   The tool start a scraping job, that usually takes around 7 seconds.
   The tool will return a snapshot/job id, that can be used to check the status of the scraping job.
   Use the tool only if the video is not in the vector store already `,
   schema: z.object({
     url:z.string(),
   }),
});

//step2 - Retrieve and Generate

//retrieval tool - think a it a custom button that agent can press to perform a specific task
const retrieveTool = tool(
  async ({ query, video_id }, { configurable: {} }) => {
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
      "Retrieve the most relevant chunks of text from the transcript for a specific youtube video",
    //input schema
    schema: z.object({
      query: z.string(),
      video_id:z.string().describe('The id of the video to retrieve'),
    }),
  }
);

const llm = new ChatAnthropic({
  model: "claude-3-haiku-20240307",
  apiKey: process.env.ANTHROPIC_API_KEY,
  system: `
    If a user gives you a YouTube link:
    1. First check if it's in the vector store using 'retrieve'.
    2. If nothing is found, call 'triggerYoutubeVideoScrape' with { url }.
    3. Wait until transcript is available, then retry 'retrieve'.
    Only answer after retrieval succeeds.
  `
});

//obj where memory is saved
const checkpointer = new MemorySaver();

export const agent = createReactAgent({
  llm,
  tools: [retrieveTool, triggerYoutubeVideoScrapeTool],
  checkpointer,
  
});
