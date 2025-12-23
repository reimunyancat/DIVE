import { Database } from "./supabase";

export interface RecommendedPlace {
  name: string;
  description: string;
  address: string;
  tags: string[];
}

export type Itinerary = Database["public"]["Tables"]["itineraries"]["Row"] & {
  itinerary_items: Database["public"]["Tables"]["itinerary_items"]["Row"][];
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateItineraryRequest {
  userId: string;
  title: string;
  items: {
    place_name: string;
    day: number;
    order: number;
    lat?: number;
    lng?: number;
    memo?: string;
  }[];
}
