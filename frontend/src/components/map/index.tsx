'use client'

import dynamic from 'next/dynamic'
import { Place } from '@/lib/store'

interface MapProps {
  places: Place[]
  selectedPlace: Place | null
  onPlaceSelect: (place: Place) => void
  center?: [number, number]
  zoom?: number
}

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-card">
      <div className="text-muted-foreground">지도 로딩 중...</div>
    </div>
  ),
})

export function Map(props: MapProps) {
  return <MapComponent {...props} />
}
