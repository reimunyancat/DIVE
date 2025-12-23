import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth Store
interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'dive-auth',
    }
  )
)

// Theme Input Store
interface ThemeInputState {
  theme: string
  region: string
  days: number
  travelStyle: 'relaxed' | 'packed'
  transportMode: 'public' | 'car'
  setTheme: (theme: string) => void
  setRegion: (region: string) => void
  setDays: (days: number) => void
  setTravelStyle: (style: 'relaxed' | 'packed') => void
  setTransportMode: (mode: 'public' | 'car') => void
  reset: () => void
}

export const useThemeInputStore = create<ThemeInputState>((set) => ({
  theme: '',
  region: '',
  days: 2,
  travelStyle: 'relaxed',
  transportMode: 'public',
  setTheme: (theme) => set({ theme }),
  setRegion: (region) => set({ region }),
  setDays: (days) => set({ days }),
  setTravelStyle: (travelStyle) => set({ travelStyle }),
  setTransportMode: (transportMode) => set({ transportMode }),
  reset: () =>
    set({
      theme: '',
      region: '',
      days: 2,
      travelStyle: 'relaxed',
      transportMode: 'public',
    }),
}))

// Itinerary Store
export interface Place {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  category: string
  description?: string
  imageUrl?: string
  openingHours?: string
  verified: boolean
  verificationScore?: number
  themeRelevance?: string
}

export interface DaySchedule {
  day: number
  date?: string
  places: Place[]
}

interface ItineraryState {
  itinerary: DaySchedule[]
  selectedDay: number
  selectedPlace: Place | null
  isLoading: boolean
  setItinerary: (itinerary: DaySchedule[]) => void
  setSelectedDay: (day: number) => void
  setSelectedPlace: (place: Place | null) => void
  setLoading: (loading: boolean) => void
  addPlace: (day: number, place: Place) => void
  removePlace: (day: number, placeId: string) => void
  movePlace: (fromDay: number, toDay: number, placeId: string) => void
  reorderPlaces: (day: number, places: Place[]) => void
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  itinerary: [],
  selectedDay: 1,
  selectedPlace: null,
  isLoading: false,
  setItinerary: (itinerary) => set({ itinerary }),
  setSelectedDay: (selectedDay) => set({ selectedDay }),
  setSelectedPlace: (selectedPlace) => set({ selectedPlace }),
  setLoading: (isLoading) => set({ isLoading }),
  addPlace: (day, place) => {
    const { itinerary } = get()
    const updated = itinerary.map((d) =>
      d.day === day ? { ...d, places: [...d.places, place] } : d
    )
    set({ itinerary: updated })
  },
  removePlace: (day, placeId) => {
    const { itinerary } = get()
    const updated = itinerary.map((d) =>
      d.day === day
        ? { ...d, places: d.places.filter((p) => p.id !== placeId) }
        : d
    )
    set({ itinerary: updated })
  },
  movePlace: (fromDay, toDay, placeId) => {
    const { itinerary } = get()
    let placeToMove: Place | undefined
    const updated = itinerary.map((d) => {
      if (d.day === fromDay) {
        placeToMove = d.places.find((p) => p.id === placeId)
        return { ...d, places: d.places.filter((p) => p.id !== placeId) }
      }
      if (d.day === toDay && placeToMove) {
        return { ...d, places: [...d.places, placeToMove] }
      }
      return d
    })
    set({ itinerary: updated })
  },
  reorderPlaces: (day, places) => {
    const { itinerary } = get()
    const updated = itinerary.map((d) => (d.day === day ? { ...d, places } : d))
    set({ itinerary: updated })
  },
}))
