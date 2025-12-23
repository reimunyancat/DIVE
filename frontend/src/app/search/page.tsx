'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Car, Sparkles, Train } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { useThemeInputStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function SearchPage() {
  const router = useRouter()
  const {
    theme,
    region,
    days,
    travelStyle,
    transportMode,
    setTheme,
    setRegion,
    setDays,
    setTravelStyle,
    setTransportMode,
  } = useThemeInputStore()

  const [themeInput, setThemeInput] = useState(theme)
  const [regionInput, setRegionInput] = useState(region)

  const handleGenerateItinerary = () => {
    setTheme(themeInput)
    setRegion(regionInput)
    router.push('/loading')
  }

  const popularRegions = ['도쿄', '오사카', '교토', '서울', '부산', '후쿠오카']
  const recommendedTags = [
    '애니메이션 성지',
    '맛집 투어',
    '전통문화',
    '자연경관',
    '쇼핑',
    '야경',
  ]

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />

      <main className="flex-1 pl-16">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#242424] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-white">여행 설정</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Theme Input */}
            <div className="rounded-xl bg-[#242424] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-medium text-white">
                <Sparkles className="h-5 w-5 text-primary" />
                테마 키워드
              </h2>
              <input
                type="text"
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                placeholder="OOO애니성지투어"
                className="mb-4 w-full rounded-lg bg-[#1a1a1a] px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex flex-wrap gap-2">
                {recommendedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setThemeInput(themeInput ? `${themeInput}, ${tag}` : tag)}
                    className="rounded-full border border-gray-600 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-primary hover:text-primary"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Selection */}
            <div className="rounded-xl bg-[#242424] p-5">
              <h2 className="mb-4 text-base font-medium text-white">여행 지역</h2>
              <input
                type="text"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                placeholder="지역을 입력하세요"
                className="mb-4 w-full rounded-lg bg-[#1a1a1a] px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex flex-wrap gap-2">
                {popularRegions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegionInput(r)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-sm transition-colors',
                      regionInput === r
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-600 text-gray-400 hover:border-primary hover:text-primary'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Duration */}
            <div className="rounded-xl bg-[#242424] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-medium text-white">
                <Calendar className="h-5 w-5 text-primary" />
                여행 기간
              </h2>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-base font-medium transition-colors',
                      days === d
                        ? 'bg-primary text-white'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    )}
                  >
                    {d}
                  </button>
                ))}
                <span className="ml-1 text-gray-400">박</span>
              </div>
            </div>

            {/* Travel Style */}
            <div className="rounded-xl bg-[#242424] p-5">
              <h2 className="mb-4 text-base font-medium text-white">여행 스타일</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTravelStyle('relaxed')}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-6 transition-all',
                    travelStyle === 'relaxed'
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-gray-700 bg-[#1a1a1a] text-gray-400 hover:border-gray-500'
                  )}
                >
                  <span className="text-2xl">🌿</span>
                  <span className="font-medium">여유롭게</span>
                  <span className="text-xs text-gray-500">하루 3-4곳</span>
                </button>
                <button
                  onClick={() => setTravelStyle('packed')}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-6 transition-all',
                    travelStyle === 'packed'
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-gray-700 bg-[#1a1a1a] text-gray-400 hover:border-gray-500'
                  )}
                >
                  <span className="text-2xl">⚡</span>
                  <span className="font-medium">빽빽하게</span>
                  <span className="text-xs text-gray-500">하루 5-7곳</span>
                </button>
              </div>
            </div>

            {/* Transport Mode */}
            <div className="rounded-xl bg-[#242424] p-5">
              <h2 className="mb-4 text-base font-medium text-white">이동 수단</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTransportMode('public')}
                  className={cn(
                    'flex items-center justify-center gap-3 rounded-xl border p-4 transition-all',
                    transportMode === 'public'
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-gray-700 bg-[#1a1a1a] text-gray-400 hover:border-gray-500'
                  )}
                >
                  <Train className="h-5 w-5" />
                  <span className="font-medium">대중교통</span>
                </button>
                <button
                  onClick={() => setTransportMode('car')}
                  className={cn(
                    'flex items-center justify-center gap-3 rounded-xl border p-4 transition-all',
                    transportMode === 'car'
                      ? 'border-primary bg-primary/20 text-white'
                      : 'border-gray-700 bg-[#1a1a1a] text-gray-400 hover:border-gray-500'
                  )}
                >
                  <Car className="h-5 w-5" />
                  <span className="font-medium">자동차</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateItinerary}
              size="lg"
              className="h-14 w-full bg-primary text-lg font-medium hover:bg-primary/90"
              disabled={!themeInput || !regionInput}
            >
              AI 일정 생성하기
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
