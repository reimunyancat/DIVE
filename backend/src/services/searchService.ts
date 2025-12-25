import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_SEARCH_CX;

export const searchPlace = async (query: string) => {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.warn(
      "Google Search API Key or CX is missing. Skipping real search."
    );
    return [];
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
      query
    )}&num=10`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items;
    }
    return [];
  } catch (error) {
    console.error("Google Search Error:", error);
    return [];
  }
};
