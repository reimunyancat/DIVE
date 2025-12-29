'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Heart, MapPin, Calendar, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

interface SharedItinerary {
  id: string
  title: string
  theme: string
  region: string
  duration: number
  thumbnail_url: string | null
  likes_count: number
  views_count: number
  is_public: boolean
  created_at: string
  user_id: string
  profiles: {
    username: string
    avatar_url: string | null
  } | null
  itinerary_items: {
    id: string
    place_name: string
    day: number
    order: number
  }[]
}

export default function CommunityPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [itineraries, setItineraries] = useState<SharedItinerary[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  // 공개된 일정 로드
  const loadItineraries = async () => {
    setLoading(true)
    
    let query = supabase
      .from('itineraries')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        itinerary_items (id, place_name, day, order)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,theme.ilike.%${searchQuery}%,region.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (!error && data) {
      setItineraries(data as SharedItinerary[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItineraries()
  }, [])

  // 검색 핸들러
  const handleSearch = () => {
    loadItineraries()
  }

  // 일정 상세보기
  const viewItinerary = (id: string) => {
    router.push(`/itinerary/${id}`)
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />

      <main className="flex-1 pl-16">
        <div className="mx-auto max-w-6xl px-8 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="테마를 검색해주세요"
                className="w-full rounded-full bg-white py-4 pl-12 pr-6 text-black placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Itineraries Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : itineraries.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-gray-500">
              <p className="text-lg">공유된 여행 일정이 없습니다</p>
              <p className="mt-2 text-sm">일정을 만들고 공유해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {itineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onClick={() => viewItinerary(itinerary.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// 일정 카드 컴포넌트
function ItineraryCard({
  itinerary,
  onClick,
}: {
  itinerary: SharedItinerary
  onClick: () => void
}) {
  const totalPlaces = itinerary.itinerary_items?.length || 0
  const totalDays = Math.max(...(itinerary.itinerary_items?.map(i => i.day) || [1]))

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-lg bg-[#242424] transition-transform hover:scale-[1.02]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full bg-gray-700">
        {itinerary.thumbnail_url ? (
          <Image
            src={itinerary.thumbnail_url}
            alt={itinerary.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/30 to-purple-600/30">
            <MapPin className="h-12 w-12 text-white/50" />
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
          {totalDays}박 {totalDays + 1}일
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Author */}
        <div className="mb-2 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-600" />
          <span className="text-sm text-gray-400">
            {itinerary.profiles?.username || '익명'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white line-clamp-1">
          {itinerary.title}
        </h3>
        
        {/* Region & Theme */}
        {(itinerary.region || itinerary.theme) && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">
            {itinerary.region && <span>{itinerary.region}</span>}
            {itinerary.region && itinerary.theme && <span> · </span>}
            {itinerary.theme && <span>{itinerary.theme}</span>}
          </p>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{totalPlaces}개 장소</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{itinerary.likes_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{itinerary.views_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
