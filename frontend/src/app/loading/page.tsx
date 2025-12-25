"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeInputStore, useItineraryStore, Place } from "@/lib/store";
import { api } from "@/lib/api";

export default function LoadingPage() {
  const router = useRouter();
  const { theme, region, days, travelStyle } = useThemeInputStore();
  const { setItinerary, setLoading } = useItineraryStore();
  const [dots, setDots] = useState("..");
  const [status, setStatus] = useState("AI가 일정을 생성 중입니다");

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Call backend API
    generateItinerary();

    return () => {
      clearInterval(dotsInterval);
    };
  }, []);

  const generateItinerary = async () => {
    try {
      setStatus("테마를 분석하고 있습니다");

      // 백엔드 API 호출 - AI 일정 생성
      const duration = `${days}박 ${days + 1}일`;
      const response = await api.generateSchedule(theme, region, duration);

      if (response.success && response.data) {
        setStatus("일정을 구성하고 있습니다");

        // API 응답을 프론트엔드 형식으로 변환
        const itinerary = response.data.map((dayData) => ({
          day: dayData.day,
          date: new Date(Date.now() + (dayData.day - 1) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          places: dayData.places.map(
            (place, index): Place => ({
              id: `place-${dayData.day}-${index}`,
              name: place.name,
              address: place.address || region,
              lat: place.lat || 35.6762 + Math.random() * 0.05,
              lng: place.lng || 139.6503 + Math.random() * 0.05,
              category: "관광",
              description: place.description,
              imageUrl: `https://picsum.photos/400/300?random=${dayData.day}${index}`,
              verified: true,
              verificationScore: 85 + Math.floor(Math.random() * 15),
              themeRelevance: `${theme} 테마와 높은 연관성을 가집니다.`,
            })
          ),
        }));

        setItinerary(itinerary);
        setLoading(false);
        router.push("/itinerary");
      } else {
        // API 실패 시 mock 데이터 사용
        console.warn("API failed, using mock data:", response.error);
        generateMockItinerary();
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      // 에러 시 mock 데이터 사용
      generateMockItinerary();
    }
  };

  const generateMockItinerary = () => {
    setStatus("일정을 구성하고 있습니다");

    const placesPerDay = travelStyle === "packed" ? 6 : 4;
    const mockItinerary = Array.from({ length: days + 1 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      places: Array.from(
        { length: placesPerDay },
        (_, placeIndex): Place => ({
          id: `place-${dayIndex}-${placeIndex}`,
          name: `${region} 명소 ${placeIndex + 1}`,
          address: `${region} 시내 ${placeIndex + 1}번가`,
          lat: 35.6762 + Math.random() * 0.1,
          lng: 139.6503 + Math.random() * 0.1,
          category: ["관광", "맛집", "카페", "쇼핑"][
            Math.floor(Math.random() * 4)
          ],
          description: `${theme}과 관련된 인기 장소입니다.`,
          imageUrl: `https://picsum.photos/400/300?random=${dayIndex}${placeIndex}`,
          verified: Math.random() > 0.3,
          verificationScore: Math.floor(Math.random() * 30) + 70,
          themeRelevance: `이 장소는 ${theme} 테마와 높은 연관성을 가집니다.`,
        })
      ),
    }));

    setTimeout(() => {
      setItinerary(mockItinerary);
      setLoading(false);
      router.push("/itinerary");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a]">
      <h1 className="text-6xl font-bold tracking-wider">
        <span className="loading-text">LOADING{dots}</span>
      </h1>
      <p className="mt-4 text-gray-500">{status}</p>
    </div>
  );
}
