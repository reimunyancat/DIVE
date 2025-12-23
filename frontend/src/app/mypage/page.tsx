'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Folder, ChevronRight, Plus } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/store'

interface SavedItinerary {
  id: string
  title: string
  region: string
  theme: string
  days: number
  createdAt: string
  thumbnails: string[]
  placesCount: number
}

export default function MyPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    setItineraries([
      {
        id: '1',
        title: '도쿄 애니메이션 성지순례',
        region: '도쿄',
        theme: '애니메이션',
        days: 3,
        createdAt: '2024-01-15',
        thumbnails: [
          'https://picsum.photos/200/150?random=1',
          'https://picsum.photos/200/150?random=2',
          'https://picsum.photos/200/150?random=3',
        ],
        placesCount: 12,
      },
      {
        id: '2',
        title: '교토 전통문화 투어',
        region: '교토',
        theme: '전통문화',
        days: 2,
        createdAt: '2024-01-10',
        thumbnails: [
          'https://picsum.photos/200/150?random=4',
          'https://picsum.photos/200/150?random=5',
        ],
        placesCount: 8,
      },
      {
        id: '3',
        title: '오사카 맛집 탐방',
        region: '오사카',
        theme: '맛집',
        days: 2,
        createdAt: '2024-01-05',
        thumbnails: [
          'https://picsum.photos/200/150?random=6',
          'https://picsum.photos/200/150?random=7',
          'https://picsum.photos/200/150?random=8',
          'https://picsum.photos/200/150?random=9',
        ],
        placesCount: 10,
      },
    ])
  }, [])

  const stats = {
    totalTrips: itineraries.length,
    totalPlaces: itineraries.reduce((acc, i) => acc + i.placesCount, 0),
    themes: [...new Set(itineraries.map((i) => i.theme))].length,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 pl-16">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Profile Header */}
          <div className="mb-12">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                {user?.name?.[0] || 'D'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name || '여행자'}</h1>
                <p className="text-muted-foreground">
                  {user?.email || 'demo@dive.app'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalTrips}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  총 여행 일정
                </div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalPlaces}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  방문 장소
                </div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.themes}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  테마 다이빙
                </div>
              </Card>
            </div>
          </div>

          {/* My Itineraries */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">내 일정</h2>
              <Button onClick={() => router.push('/search')}>
                <Plus className="mr-2 h-4 w-4" />
                새 일정 만들기
              </Button>
            </div>

            {itineraries.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  저장된 일정이 없습니다
                </h3>
                <p className="mb-4 text-muted-foreground">
                  새로운 테마 여행을 시작해보세요!
                </p>
                <Button onClick={() => router.push('/search')}>
                  일정 만들기
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {itineraries.map((itinerary, index) => (
                  <motion.div
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="cursor-pointer p-4 transition-colors hover:bg-muted/50"
                      onClick={() => router.push(`/itinerary/${itinerary.id}`)}
                    >
                      <div className="flex gap-4">
                        {/* Thumbnails */}
                        <div className="flex gap-1">
                          {itinerary.thumbnails.slice(0, 3).map((thumb, i) => (
                            <div
                              key={i}
                              className="relative h-20 w-20 overflow-hidden rounded-lg"
                            >
                              <Image
                                src={thumb}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {itinerary.thumbnails.length > 3 && (
                            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                              +{itinerary.thumbnails.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{itinerary.title}</h3>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {itinerary.region}
                                <span>•</span>
                                <Calendar className="h-4 w-4" />
                                {itinerary.days}박 {itinerary.days + 1}일
                              </div>
                            </div>
                            <Badge variant="outline">{itinerary.theme}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {itinerary.placesCount}개 장소 •{' '}
                              {new Date(itinerary.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Achievement */}
          <section className="mt-12">
            <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="font-semibold">
                    당신은 총 {stats.themes}개의 테마에 다이빙했습니다!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    새로운 테마를 탐험하고 여행의 폭을 넓혀보세요.
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}
