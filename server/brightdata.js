// 1. Load environment variables from .env
import 'dotenv/config';
const brightDataTriggerUrl = "https://api.brightdata.com/datasets/v3/trigger";

export const triggerYoutubeVideoScrape = async (url) => {
  

  const data = JSON.stringify([
    {
      url,
      country: "",
      transcription_language: "",
    },
  ]);

  const res = await fetch(
    `${brightDataTriggerUrl}?dataset_id=gd_lk56epmy2i5g7lzu0k&endpoint=https%3A%2F%2Fstreamsummarizer-1.onrender.com/webhook&format=json&uncompressed_webhook=true&include_errors=true`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: data,
    }
  );
    const result = await res.json();
    console.log("Video : ", result);
    return result.snapshot_id;
};

