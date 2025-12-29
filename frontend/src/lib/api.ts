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

  // ========== Community API ==========
  
  // 커뮤니티 게시글 목록 조회
  getCommunityPosts: (params?: { search?: string; region?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.region) searchParams.set('region', params.region)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())
    const query = searchParams.toString()
    return fetchApi<CommunityPost[]>(`/api/community/posts${query ? `?${query}` : ''}`)
  },

  // 게시글 상세 조회
  getCommunityPost: (id: string) => 
    fetchApi<CommunityPost>(`/api/community/posts/${id}`),

  // 게시글 작성
  createCommunityPost: (data: {
    userId: string
    itineraryId?: string
    title: string
    description?: string
    thumbnailUrl?: string
    region?: string
    tags?: string[]
  }) =>
    fetchApi<CommunityPost>('/api/community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 게시글 수정
  updateCommunityPost: (id: string, data: {
    title?: string
    description?: string
    thumbnailUrl?: string
    region?: string
    tags?: string[]
    isActive?: boolean
  }) =>
    fetchApi<CommunityPost>(`/api/community/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // 게시글 삭제
  deleteCommunityPost: (id: string) =>
    fetchApi(`/api/community/posts/${id}`, {
      method: 'DELETE',
    }),

  // 좋아요 토글
  toggleLike: (postId: string, userId: string) =>
    fetchApi<{ liked: boolean }>(`/api/community/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  // 사용자 게시글 목록
  getUserCommunityPosts: (userId: string) =>
    fetchApi<CommunityPost[]>(`/api/community/users/${userId}/posts`),
}

// Community Types
export interface CommunityPost {
  id: string
  user_id: string
  itinerary_id?: string
  title: string
  description?: string
  thumbnail_url?: string
  region?: string
  tags: string[]
  likes_count: number
  views_count: number
  is_active: boolean
  created_at: string
  updated_at: string
  profiles?: {
    username: string
    avatar_url?: string
  }
  itineraries?: {
    title: string
    theme: string
  }
}
