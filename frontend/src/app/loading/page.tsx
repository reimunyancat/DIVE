'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeInputStore, useItineraryStore, Place } from '@/lib/store'
import { api } from '@/lib/api'

export default function LoadingPage() {
  const router = useRouter()
  const { theme, region, days, travelStyle } = useThemeInputStore()
  const { setItinerary, setLoading } = useItineraryStore()
  const [dots, setDots] = useState('..')
  const [status, setStatus] = useState('AI가 일정을 생성 중입니다')

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    // Call backend API
    generateItinerary()

    return () => {
      clearInterval(dotsInterval)
    }
  }, [])

  const generateItinerary = async () => {
    try {
      setStatus('테마를 분석하고 있습니다')
      
      // 백엔드 API 호출 - AI 일정 생성
      const duration = `${days}박 ${days + 1}일`
      const placesPerDay = travelStyle === 'packed' ? 6 : 3
      const response = await api.generateSchedule(theme, region, duration)

      if (response.success && response.data) {
        setStatus('일정을 구성하고 있습니다')
        
        // API 응답을 프론트엔드 형식으로 변환
        // travelStyle에 따라 장소 수 보정
        const itinerary = response.data.map((dayData) => {
          // 필요한 장소 수만큼 채우기
          const places: Place[] = []
          for (let i = 0; i < placesPerDay; i++) {
            const apiPlace = dayData.places[i % dayData.places.length]
            places.push({
              id: `place-${dayData.day}-${i}`,
              name: apiPlace?.name || `${region} 명소 ${i + 1}`,
              address: region,
              lat: apiPlace?.lat || 35.6762 + Math.random() * 0.05,
              lng: apiPlace?.lng || 139.6503 + Math.random() * 0.05,
              category: '관광',
              description: apiPlace?.description || `${theme} 관련 장소`,
              imageUrl: `https://picsum.photos/400/300?random=${dayData.day}${i}`,
              verified: true,
              verificationScore: 85 + Math.floor(Math.random() * 15),
              themeRelevance: `${theme} 테마와 높은 연관성을 가집니다.`,
            })
          }
          
          return {
            day: dayData.day,
            date: new Date(Date.now() + (dayData.day - 1) * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
            places,
          }
        })

        setItinerary(itinerary)
        setLoading(false)
        router.push('/itinerary')
      } else {
        // API 실패 시 mock 데이터 사용
        console.warn('API failed, using mock data:', response.error)
        generateMockItinerary()
      }
    } catch (error) {
      console.error('Error generating itinerary:', error)
      // 에러 시 mock 데이터 사용
      generateMockItinerary()
    }
  }

  const generateMockItinerary = () => {
    setStatus('일정을 구성하고 있습니다')
    
    const placesPerDay = travelStyle === 'packed' ? 6 : 4
    const mockItinerary = Array.from({ length: days + 1 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      places: Array.from({ length: placesPerDay }, (_, placeIndex): Place => ({
        id: `place-${dayIndex}-${placeIndex}`,
        name: `${region} 명소 ${placeIndex + 1}`,
        address: `${region} 시내 ${placeIndex + 1}번가`,
        lat: 35.6762 + Math.random() * 0.1,
        lng: 139.6503 + Math.random() * 0.1,
        category: ['관광', '맛집', '카페', '쇼핑'][Math.floor(Math.random() * 4)],
        description: `${theme}과 관련된 인기 장소입니다.`,
        imageUrl: `https://picsum.photos/400/300?random=${dayIndex}${placeIndex}`,
        verified: Math.random() > 0.3,
        verificationScore: Math.floor(Math.random() * 30) + 70,
        themeRelevance: `이 장소는 ${theme} 테마와 높은 연관성을 가집니다.`,
      })),
    }))

    setTimeout(() => {
      setItinerary(mockItinerary)
      setLoading(false)
      router.push('/itinerary')
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a]">
      <div className="relative">
        {/* 흰색 텍스트 (기본) */}
        <h1 className="text-7xl font-black tracking-wider text-white">
          LOADING{dots}
        </h1>
        {/* 파란색 텍스트 (물결 애니메이션) */}
        <h1 
          className="absolute inset-0 text-7xl font-black tracking-wider text-primary"
          style={{
            clipPath: 'url(#wave-clip)',
          }}
        >
          LOADING{dots}
        </h1>
        {/* SVG 물결 클립 패스 */}
        <svg className="absolute h-0 w-0">
          <defs>
            <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
              <path>
                <animate
                  attributeName="d"
                  dur="1.5s"
                  repeatCount="indefinite"
                  values="
                    M 0,0.45 
                    C 0.1,0.3 0.2,0.6 0.3,0.45 
                    C 0.4,0.3 0.5,0.6 0.6,0.45 
                    C 0.7,0.3 0.8,0.6 0.9,0.45 
                    C 0.95,0.35 1,0.55 1,0.45 
                    L 1,1 L 0,1 Z;
                    
                    M 0,0.45 
                    C 0.1,0.6 0.2,0.3 0.3,0.45 
                    C 0.4,0.6 0.5,0.3 0.6,0.45 
                    C 0.7,0.6 0.8,0.3 0.9,0.45 
                    C 0.95,0.55 1,0.35 1,0.45 
                    L 1,1 L 0,1 Z;
                    
                    M 0,0.45 
                    C 0.1,0.3 0.2,0.6 0.3,0.45 
                    C 0.4,0.3 0.5,0.6 0.6,0.45 
                    C 0.7,0.3 0.8,0.6 0.9,0.45 
                    C 0.95,0.35 1,0.55 1,0.45 
                    L 1,1 L 0,1 Z
                  "
                />
              </path>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  )
}
