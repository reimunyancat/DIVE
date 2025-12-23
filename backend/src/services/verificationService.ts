import Groq from "groq-sdk";
import dotenv from "dotenv";
import { searchPlace } from "./searchService";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const verifyPlace = async (placeName: string) => {
  const searchResult = await searchPlace(placeName);
  let searchContext = "";

  if (searchResult) {
    searchContext = `
    [Google 검색 결과]
    제목: ${searchResult.title}
    링크: ${searchResult.link}
    요약: ${searchResult.snippet}
    `;
  }

  const prompt = `
    장소명: "${placeName}"
    ${searchContext}
    
    위의 Google 검색 결과(있다면)와 당신의 지식을 종합하여,
    이 장소가 실제로 존재하는지, 그리고 현재 운영 중인지 확인해주세요.
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
