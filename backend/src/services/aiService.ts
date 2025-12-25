import Groq from "groq-sdk";
import dotenv from "dotenv";
import { searchPlace } from "./searchService";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeTheme = async (theme: string, location: string) => {
  const searchQuery = `${location} ${theme} 여행 추천 코스`;
  const searchResults = await searchPlace(searchQuery);

  let searchContext = "";
  if (searchResults && searchResults.length > 0) {
    searchContext = `[참고할 Google 검색 결과]\n`;
    searchResults.forEach((item: any, index: number) => {
      searchContext += `${index + 1}. 제목: ${item.title}\n   내용: ${
        item.snippet
      }\n\n`;
    });
  }

  const prompt = `
    역할: 당신은 전 세계 여행 테마 전문가입니다.
    사용자가 입력한 여행 테마는 "${theme}"이고, 희망 지역은 "${location}"입니다.
    
    ${searchContext}
    
    [지시사항]
    1. 위 검색 결과와 당신의 지식을 바탕으로, 테마에 가장 적합한 장소 5곳을 추천해주세요.
    2. 정확한 명칭: 한국어로 통용되는 정확한 장소명을 사용하세요. (예: 필로소피 로드 X -> 철학의 길 O, 벙커우지 X -> 뵤도인 O)
    3. 테마 연관성: 단순히 유명한 관광지가 아니라, "${theme}" 테마와 관련된 장소를 우선 추천하세요.
      - 예: "케이온" -> 토요사토 초등학교, JEUGIA 산조점
      - 예: "맛집 투어" -> 현지인 맛집, 미슐랭 식당
    4. 설명: 이 장소가 왜 테마와 관련이 있는지 구체적으로 설명하세요.
    
    결과는 반드시 다음 JSON 형식으로만 출력해주세요.
    
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
      messages: [
        {
          role: "system",
          content:
            "당신은 정확한 여행 정보를 제공하는 AI 가이드입니다. 한국어 장소 명칭을 정확하게 사용하며, 사용자의 테마에 맞는 장소를 추천합니다.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
    });

    const text = completion.choices[0]?.message?.content || "[]";

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
  const searchQuery = `${location} ${theme} 여행 코스 추천`;
  const searchResults = await searchPlace(searchQuery);

  let searchContext = "";
  if (searchResults && searchResults.length > 0) {
    searchContext = `[참고할 Google 검색 결과]\n`;
    searchResults.forEach((item: any, index: number) => {
      searchContext += `${index + 1}. 제목: ${item.title}\n   내용: ${
        item.snippet
      }\n\n`;
    });
  }

  const prompt = `
    역할: 당신은 전 세계 여행 테마 전문가이자 효율적인 동선 설계의 달인입니다.
    여행 테마: "${theme}"
    여행 지역: "${location}"
    여행 기간: "${duration}"

    ${searchContext}

    [강력한 지시사항]
    1. 동선 최적화:
      - 하루 일정은 지리적으로 가까운 장소끼리 묶어서 구성하세요. (예: 1일차는 교토 동쪽, 2일차는 교토 서쪽)
      - 이동 시간이 너무 길어지는 비현실적인 동선은 피하세요. (동에 번쩍 서에 번쩍 금지)
      - 장소 간의 순서가 논리적이어야 합니다. (아침 -> 점심 -> 오후 -> 저녁)
    
    2. 테마 집중:
      - "${theme}"와 관련된 장소를 최우선으로 배치하세요.
      - 일반적인 관광지는 테마 장소 근처에 있을 때만 보너스로 넣으세요.
      - 예: "케이온" 테마라면 "기요미즈데라"보다는 "JEUGIA 산조점", "난젠지 수로각", "카모가와 델타", "토요사토 초등학교(시가현)" 등을 우선해야 합니다.
      - 주의: "토요사토 초등학교" 같은 핵심 성지가 시외에 있다면, 이동 시간을 고려해 하루를 온전히 할애하거나 적절히 배치하세요.
    3. 정확한 장소명: 한국어로 통용되는 정확한 명칭을 사용하세요. (필로소피 로드 X -> 철학의 길 O)
    4. 장소 개수: 하루에 3~5곳의 장소를 포함하세요. 너무 빡빡하지 않게 여유를 두세요.
    5. 설명: 단순한 설명 대신, "이곳에서 점심 식사", "오프닝에 나온 장소 인증샷" 등 구체적인 행동 가이드를 포함하세요.

    결과는 반드시 다음 JSON 형식으로만 출력해주세요.
    
    [
      {
        "day": 1,
        "places": [
          {
            "name": "장소명",
            "description": "테마와 관련된 설명",
            "time": "10:00"
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
      messages: [
        {
          role: "system",
          content:
            "당신은 정확한 여행 정보를 제공하는 AI 가이드입니다. 한국어 장소 명칭을 정확하게 사용하며, 사용자의 테마에 맞는 장소를 추천합니다.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
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
