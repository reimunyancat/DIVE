import Groq from "groq-sdk";
import dotenv from "dotenv";
import { searchPlace } from "./searchService";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const verifyPlace = async (placeName: string) => {
  const searchResults = await searchPlace(placeName);
  let searchContext = "";

  if (searchResults && searchResults.length > 0) {
    searchContext = `[Google 검색 결과 (상위 10개)]\n`;
    searchResults.forEach((item: any, index: number) => {
      searchContext += `${index + 1}. 제목: ${item.title}\n   요약: ${
        item.snippet
      }\n   링크: ${item.link}\n\n`;
    });
  }

  const prompt = `
    장소명: "${placeName}"
    
    ${searchContext}
    
    [지시사항]
    위 검색 결과를 분석하여 해당 장소의 실존 여부와 운영 상태를 검증하세요.
    
    결과는 다음 JSON 형식으로만 출력해주세요.
    
    {
      "exists": true/false,
      "verification_score": 0~100 사이의 정수 (신뢰도),
      "reason": "판단 이유 한 줄 요약"
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Verification Error:", error);
    return {
      exists: true,
      verification_score: 50,
      reason: "Verification failed",
    };
  }
};
