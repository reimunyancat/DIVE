'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Place } from '@/lib/store'

interface MapClientProps {
  places: Place[]
  selectedPlace: Place | null
  onPlaceSelect: (place: Place) => void
  center?: [number, number]
  zoom?: number
}

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapClient({
  places,
  selectedPlace,
  onPlaceSelect,
  center = [35.6762, 139.6503],
  zoom = 13,
}: MapClientProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const polylineRef = useRef<L.Polyline | null>(null)

  // Custom marker icon
  const createCustomIcon = (isSelected: boolean, isVerified: boolean) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative">
          <div class="w-8 h-8 rounded-full flex items-center justify-center ${
            isSelected ? 'bg-primary scale-125' : isVerified ? 'bg-green-500' : 'bg-blue-500'
          } text-white shadow-lg transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          ${isVerified ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">✓</div>' : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
    })

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current)

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.remove()
      polylineRef.current = null
    }

    if (places.length === 0) return

    // Add new markers
    const coords: [number, number][] = []

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id
      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon(isSelected, place.verified),
      })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${place.name}</h3>
            <p class="text-sm text-gray-400">${place.address}</p>
          </div>
        `)
        .on('click', () => onPlaceSelect(place))

      markersRef.current.push(marker)
      coords.push([place.lat, place.lng])
    })

    // Draw route polyline
    if (coords.length > 1) {
      polylineRef.current = L.polyline(coords, {
        color: '#3B82F6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
      }).addTo(mapRef.current)
    }

    // Fit bounds to show all markers
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords)
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [places, selectedPlace, onPlaceSelect])

  // Pan to selected place
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return

    mapRef.current.panTo([selectedPlace.lat, selectedPlace.lng], {
      animate: true,
      duration: 0.5,
    })
  }, [selectedPlace])

  return (
    <div ref={mapContainerRef} className="h-full w-full">
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  )
}
