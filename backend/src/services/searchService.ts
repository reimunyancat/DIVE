import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_SEARCH_CX;

export const searchPlace = async (query: string) => {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.warn(
      "Google Search API Key or CX is missing. Skipping real search."
    );
    return null;
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0]; // 가장 첫 번째 검색 결과 반환
    }
    return null;
  } catch (error) {
    console.error("Google Search Error:", error);
    return null;
  }
};
