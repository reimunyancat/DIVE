"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Share2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Map } from "@/components/map";
import { Place as StorePlace } from "@/lib/store";

interface Place extends StorePlace {
  day: number;
  order: number;
}

interface ItineraryDetail {
  id: string;
  title: string;
  theme: string;
  items: Place[];
  created_at: string;
}

export default function ItineraryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<ItineraryDetail | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.getItinerary(params.id);
        if (response.success && response.data) {
          const data = response.data as any;
          // DB 데이터를 프론트엔드 형식으로 변환
          const items = data.itinerary_items.map((item: any) => ({
            id: item.id,
            name: item.place_name,
            description: item.memo,
            address: "주소 정보 없음", // DB에 주소가 없으면 기본값
            lat: item.lat,
            lng: item.lng,
            category: "attraction", // Default category
            verified: true, // Default verified status
            day: item.day,
            order: item.order,
          }));

          setItinerary({
            id: data.id,
            title: data.title,
            theme: data.theme,
            items: items,
            created_at: data.created_at,
          });
        }
      } catch (error) {
        console.error("Failed to fetch itinerary:", error);
      }
    };

    fetchItinerary();
  }, [params.id]);

  if (!itinerary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] text-white">
        로딩 중...
      </div>
    );
  }

  const days = [...new Set(itinerary.items.map((item) => item.day))].sort(
    (a, b) => a - b
  );
  const currentPlaces = itinerary.items
    .filter((item) => item.day === selectedDay)
    .sort((a, b) => a.order - b.order);

  // Calculate center for map
  const mapCenter: [number, number] =
    currentPlaces.length > 0
      ? [currentPlaces[0].lat, currentPlaces[0].lng]
      : [35.6762, 139.6503]; // Default to Tokyo

  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <Sidebar />

      <main className="flex-1 pl-16">
        <div className="flex h-screen">
          {/* Left Panel - Schedule List */}
          <div className="flex w-[400px] flex-col border-r border-[#333] bg-[#1a1a1a]">
            {/* Header */}
            <div className="border-b border-[#333] p-6">
              <div className="mb-4 flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#242424] hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold text-white">
                  {itinerary.title}
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
                    {itinerary.theme}
                  </span>
                  <span className="rounded-full bg-[#333] px-3 py-1 text-xs text-gray-400">
                    {days.length}일 코스
                  </span>
                </div>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto border-b border-[#333] p-4 scrollbar-hide">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selectedDay === day
                      ? "bg-primary text-white"
                      : "bg-[#242424] text-gray-400 hover:bg-[#333] hover:text-white"
                  )}
                >
                  Day {day}
                </button>
              ))}
            </div>

            {/* Place List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {currentPlaces.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedPlace(place);
                      setShowPlaceDetail(true);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all hover:bg-[#2a2a2a]",
                      selectedPlace?.id === place.id
                        ? "bg-[#2a2a2a] ring-1 ring-primary"
                        : "bg-[#242424]"
                    )}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-white">
                        {place.name}
                      </h4>
                      <p className="truncate text-xs text-gray-500">
                        {place.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="flex-1 bg-[#242424] relative">
            <Map
              places={currentPlaces}
              selectedPlace={selectedPlace}
              onPlaceSelect={(place) => {
                setSelectedPlace(place as Place);
                setShowPlaceDetail(true);
              }}
              center={mapCenter}
              zoom={13}
            />
          </div>
        </div>
      </main>

      {/* Place Detail Dialog */}
      <Dialog open={showPlaceDetail} onOpenChange={setShowPlaceDetail}>
        <DialogContent className="max-w-lg bg-[#1a1a1a] text-white border-[#333]">
          <DialogHeader>
            <DialogTitle>장소 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedPlace && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{selectedPlace.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {selectedPlace.address}
                </p>
              </div>
              {selectedPlace.description && (
                <div className="rounded-lg bg-[#2a2a2a] p-4">
                  <h3 className="mb-2 font-semibold text-white">장소 소개</h3>
                  <p className="text-sm text-gray-300">
                    {selectedPlace.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
