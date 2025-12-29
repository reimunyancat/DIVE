'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Share2 } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Map } from '@/components/map'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useItineraryStore, useThemeInputStore, useAuthStore, Place } from '@/lib/store'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function ItineraryPage() {
  const router = useRouter()
  const { theme, region, duration } = useThemeInputStore()
  const { user } = useAuthStore()
  const {
    itinerary,
    selectedDay,
    selectedPlace,
    setSelectedDay,
    setSelectedPlace,
  } = useItineraryStore()

  const [showPlaceDetail, setShowPlaceDetail] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedItineraryId, setSavedItineraryId] = useState<string | null>(null)

  const currentDaySchedule = itinerary.find((d) => d.day === selectedDay)
  const currentPlaces = currentDaySchedule?.places || []

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place)
  }

  const handlePlaceDoubleClick = (place: Place) => {
    setSelectedPlace(place)
    setShowPlaceDetail(true)
  }

  const handleSaveItinerary = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    setIsSaving(true)
    try {
      // 일정 데이터를 백엔드 형식으로 변환
      const items = itinerary.flatMap((day) =>
        day.places.map((place, index) => ({
          place_name: place.name,
          day: day.day,
          order: index + 1,
          lat: place.lat,
          lng: place.lng,
          memo: place.description || '',
        }))
      )

      const response = await api.saveItinerary({
        userId: user.id,
        title: `${region} ${theme} 여행`,
        theme: theme,
        items,
      })

      if (response.success && response.data) {
        setSavedItineraryId((response.data as any).id)
        setShowShareModal(true)
      } else {
        alert('저장에 실패했습니다: ' + response.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 커뮤니티에 공유하기
  const handleShare = async () => {
    if (!savedItineraryId) return

    try {
      const { error } = await supabase
        .from('itineraries')
        .update({ 
          is_public: true,
          region: region,
          duration: duration,
        })
        .eq('id', savedItineraryId)

      if (error) throw error

      alert('일정이 커뮤니티에 공유되었습니다!')
      setShowShareModal(false)
      router.push('/community')
    } catch (error) {
      console.error('Share error:', error)
      alert('공유에 실패했습니다.')
    }
  }

  if (itinerary.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <Sidebar />
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-white">일정이 없습니다</h2>
          <Button onClick={() => router.push('/search')}>일정 만들기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />

      <main className="flex flex-1 pl-16">
        {/* Left: Map Section */}
        <div className="relative flex w-[38%] flex-shrink-0 flex-col border-r border-gray-800">
          {/* Day Label on Map */}
          <div className="absolute left-4 top-4 z-10 rounded bg-white px-3 py-1">
            <span className="font-semibold text-black">Day{selectedDay}.</span>
          </div>

          {/* Map */}
          <div className="h-[60%]">
            <Map
              places={currentPlaces}
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceClick}
            />
          </div>

          {/* Selected Place Preview */}
          {selectedPlace && (
            <div className="flex-1 bg-[#1a1a1a] p-4">
              <h3 className="mb-1 text-lg font-semibold text-white">{selectedPlace.name}</h3>
              <p className="mb-4 text-sm text-gray-400">{selectedPlace.address}</p>
              
              {/* Images Grid */}
              <div className="flex gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] w-1/2 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={`https://picsum.photos/400/300?random=${selectedPlace.id}${i}`}
                      alt={selectedPlace.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Day Columns */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-end border-b border-gray-800 px-4 py-3">
            <Button
              onClick={handleSaveItinerary}
              size="sm"
              className="bg-primary px-4"
              disabled={isSaving}
            >
              {isSaving ? '저장 중...' : '일정 저장'}
            </Button>
          </div>

          {/* Scrollable Day Columns */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex h-full min-w-max">
              {itinerary.map((day) => (
                <div
                  key={day.day}
                  className="flex h-full w-[280px] flex-shrink-0 flex-col border-r border-gray-800 last:border-r-0"
                >
                  {/* Day Header */}
                  <div className="border-b border-gray-800 px-4 py-3">
                    <h2 className="text-lg font-semibold text-white">Day{day.day}.</h2>
                    <p className="text-xs text-gray-500">{region} 탐험</p>
                  </div>

                  {/* Places List */}
                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-2">
                      {day.places.map((place, index) => (
                        <motion.div
                          key={place.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setSelectedDay(day.day)
                            handlePlaceClick(place)
                          }}
                          onDoubleClick={() => handlePlaceDoubleClick(place)}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-lg bg-[#242424] p-2 transition-all hover:bg-[#2a2a2a]',
                            selectedPlace?.id === place.id && selectedDay === day.day
                              ? 'ring-1 ring-primary'
                              : ''
                          )}
                        >
                          {/* Thumbnail */}
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={place.imageUrl || `https://picsum.photos/100/100?random=${place.id}`}
                              alt={place.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <h4 className="truncate text-xs font-medium text-primary">
                                {place.name}
                              </h4>
                              {place.verified && (
                                <CheckCircle className="h-3 w-3 flex-shrink-0 text-blue-400" />
                              )}
                            </div>
                            <p className="truncate text-xs text-gray-500">
                              {place.address}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Place Detail Dialog */}
      <Dialog open={showPlaceDetail} onOpenChange={setShowPlaceDetail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>장소 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedPlace && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedPlace.imageUrl || `https://picsum.photos/400/300?random=${selectedPlace.id}`}
                  alt={selectedPlace.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{selectedPlace.name}</h2>
                  {selectedPlace.verified && (
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                      DIVE 인증
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {selectedPlace.address}
                </p>
              </div>
              {selectedPlace.themeRelevance && (
                <div className="rounded-lg bg-primary/10 p-4">
                  <h3 className="mb-2 font-semibold text-primary">테마 부합성</h3>
                  <p className="text-sm">{selectedPlace.themeRelevance}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>일정이 저장되었습니다! 🎉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-400">
              이 여행 일정을 커뮤니티에 공유하시겠습니까?<br />
              다른 사람들이 내 일정을 참고할 수 있어요.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowShareModal(false)}
              >
                나중에
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
