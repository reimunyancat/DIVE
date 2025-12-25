const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "API request failed" };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "Network error" };
  }
}

// API 응답 타입 정의
export interface RecommendedPlace {
  name: string;
  description: string;
  address: string;
  tags: string[];
  lat?: number;
  lng?: number;
}

export interface SchedulePlace {
  name: string;
  description: string;
  address?: string;
  time: string;
  lat?: number;
  lng?: number;
}

export interface DaySchedule {
  day: number;
  places: SchedulePlace[];
}

export interface VerificationResult {
  exists: boolean;
  verification_score: number;
  reason: string;
}

export interface RouteResult {
  distance: string;
  duration: string;
  type: string;
}

export const api = {
  // 테마 분석 및 장소 추천
  analyzeTheme: (theme: string, location: string) =>
    fetchApi<RecommendedPlace[]>("/api/theme/analyze", {
      method: "POST",
      body: JSON.stringify({ theme, location }),
    }),

  // AI 일정 생성
  generateSchedule: (theme: string, location: string, duration: string) =>
    fetchApi<DaySchedule[]>("/api/theme/schedule", {
      method: "POST",
      body: JSON.stringify({ theme, location, duration }),
    }),

  // 장소 팩트체크
  verifyPlace: (placeName: string) =>
    fetchApi<VerificationResult>("/api/verify", {
      method: "POST",
      body: JSON.stringify({ placeName }),
    }),

  // 경로 계산
  calculateRoute: (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
  ) =>
    fetchApi<RouteResult>("/api/route/calculate", {
      method: "POST",
      body: JSON.stringify({ start, end }),
    }),

  // 일정 저장
  saveItinerary: (data: {
    userId: string;
    title: string;
    theme: string;
    items: {
      place_name: string;
      day: number;
      order: number;
      lat?: number;
      lng?: number;
      memo?: string;
    }[];
  }) =>
    fetchApi("/api/itinerary", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 일정 조회
  getItinerary: (id: string) => fetchApi(`/api/itinerary/${id}`),

  // 사용자 일정 목록 조회
  getUserItineraries: (userId: string) =>
    fetchApi(`/api/itinerary/user/${userId}`),
};
