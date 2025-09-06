import { pipeline } from "@xenova/transformers";

class XenovaEmbeddings {
  constructor(model = "Xenova/all-MiniLM-L6-v2") {
    //selects model
    this.model = model;
  }

  async init() {
    //pipeline - sets model for specific task
    //feature extraction - raw text to numbers
    //embedder is obj that contains vector
    this.embedder = await pipeline("feature-extraction", this.model);
  }

  async embedDocuments(documents) {
    const embeddings = [];
    for (const doc of documents) {
      if (!doc.pageContent) continue;
      try {
        const result = await this.embedder(doc.pageContent);
        const vector = Array.from(result.data);
        embeddings.push(vector);
      } catch (err) {
        console.error("Embedding error:", err.message);
      }
    }
    return embeddings;
  }
  async embedQuery(text) {
    try {
      const res = await this.embedder(text);
      const vector = Array.from(res.data);

      return vector;
    } catch (err) {
      console.error("Query embedding error:", err.message);
      // Return an empty array or throw an error to signal failure
      return [];
    }
  }
}

 //3)embedding

  const xenova = new XenovaEmbeddings();
  await xenova.init();

  const vectorSize = 384; 

  export {xenova, vectorSize};

