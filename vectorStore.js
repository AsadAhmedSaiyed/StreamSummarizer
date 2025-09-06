import "dotenv/config";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { xenova, vectorSize } from "./embeddings.js";
import { qdrant } from "./qdrantClient.js";
import { v4 as uuidv4 } from "uuid";

const COLLECTION_NAME = "video_transcripts"; //collec
const BATCH_SIZE = 10;

//ensuring all vectors are of fixed and same dim
const padVector = (vector, size) => {
  const fixed = new Array(size).fill(0);
  for (let i = 0; i < Math.min(vector.length, size); i++) {
    fixed[i] = vector[i];
  }
  return fixed;
};

//4)storing vector in DB (RAM for this project)

//creates local db to store vectors
//by passing xenova obj we tell whenever need convert text - vectors using xenova

export const initVectorStore = async () => {
  const collections = await qdrant.getCollections();
  if (!collections.collections.find((c) => c.name === COLLECTION_NAME)) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: vectorSize, distance: "Cosine" },
    });
    console.log("Qdrant collection created!");
  } else {
    console.log("Qdrant collection already exists.");
  }

  //create an index on video_id for filtering'
  try {
    await qdrant._openApiClient.createFieldIndex({
      collection_name: COLLECTION_NAME,
      field_name: "video_id",
      field_schema: "keyword",
    });
    console.log("Index on video_id created/ensured!");
  } catch (e) {
    if (e?.data?.status?.error?.includes("already exists")) {
      console.log("Index on video_id already exists.");
    } else {
      console.error("Error creating index on video_id:", e);
    }
  }

  console.log("Vector store initialized!");
};

export const addYTVideoToVectorStore = async (videoData) => {
  const { transcript, video_id } = videoData;

  console.log(`Processing video: ${video_id}`);

  //array of docs
  const docs = [
    new Document({
      pageContent: transcript,
      metadata: { video_id: video_id },
    }),
  ];

  //2)splitting video into meaningfull chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800, //size of each chunk
    chunkOverlap: 150, //add last 200 char to next chunk from this so that we don't loose context
  });

  //array of objs
  const chunks = await splitter.splitDocuments(docs);
  console.log(`Chunks created: ${chunks.length}`);
  //embedding part
  let embeddedChunks = await xenova.embedDocuments(chunks);

  embeddedChunks = embeddedChunks.map((v) => padVector(v, vectorSize));

  console.log(`Embeddings done for video: ${video_id}`);

  //prepare qdrant points
  const points = embeddedChunks.map((vector, idx) => ({
    id: uuidv4(),
    vector,
    payload: {
      video_id,
      content: chunks[idx].pageContent,
    },
  }));

  //store vector
  //batch insert
  try {
    for (let i = 0; i < points.length; i += BATCH_SIZE) {
      const batch = points.slice(i, i + BATCH_SIZE);

      await qdrant._openApiClient.upsertPoints({
        collection_name: COLLECTION_NAME,
        points: batch,
      });
    }
  } catch (e) {
    console.error(e);
  }

  console.log(`Vectors added to DB for video: ${video_id}`);
};

// similarity search
export const similaritySearch = async (query, topk = 5, video_id = null) => {
  //embed query
  const queryVector = padVector(await xenova.embedQuery(query), vectorSize);

  //filter
  const filter = video_id
    ? { must: [{ key: "video_id", match: { value: video_id } }] }
    : undefined;

  //search
  const res = await qdrant._openApiClient.searchPoints({
    collection_name: COLLECTION_NAME,
    vector: queryVector,
    limit: topk,
    filter,
    with_payload: true,
  });

  const results = res?.data?.result;

  console.log("Results : ",results);

  //maps res
  return results.map((r) => ({
    id: r.id,
    score: r.score,
    content: r.payload.content,
    video_id: r.payload.video_id,
  }));
};
