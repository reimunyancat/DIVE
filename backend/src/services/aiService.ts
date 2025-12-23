import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeTheme = async (theme: string, location: string) => {
  const prompt = `
    사용자가 입력한 여행 테마는 "${theme}"이고, 희망 지역은 "${location}"입니다.
    이 테마와 지역에 맞는 여행 장소 5곳을 추천해주세요.
    
    결과는 반드시 다음 JSON 형식으로만 출력해주세요. 마크다운이나 다른 텍스트는 포함하지 마세요.
    
    [
      {
        "name": "장소명",
        "description": "장소에 대한 한 줄 설명 (테마와 관련된 이유)",
        "address": "대략적인 주소 (시/구/동)",
        "tags": ["태그1", "태그2"]
      }
    ]
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content || "[]";

    // JSON 파싱 (혹시 모를 마크다운 코드 블록 제거)
    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to analyze theme");
  }
};

export const generateSchedule = async (
  theme: string,
  location: string,
  duration: string
) => {
  const prompt = `
    여행 테마: "${theme}"
    여행 지역: "${location}"
    여행 기간: "${duration}" (예: 2박 3일)

    위 정보를 바탕으로 최적의 여행 일정을 생성해주세요.
    이동 거리와 운영 시간을 고려하여 현실적인 동선으로 짜주세요.
    
    결과는 반드시 다음 JSON 형식으로만 출력해주세요.
    
    [
      {
        "day": 1,
        "places": [
          {
            "name": "장소명",
            "description": "한 줄 설명",
            "time": "예상 방문 시간 (예: 10:00 AM)"
          }
        ]
      },
      {
        "day": 2,
        "places": [...]
      }
    ]
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const text = completion.choices[0]?.message?.content || "[]";

    const jsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Groq Schedule Error:", error);
    throw new Error("Failed to generate schedule");
  }
};
