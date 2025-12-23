export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      itineraries: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          is_public?: boolean;
          created_at?: string;
        };
      };
      itinerary_items: {
        Row: {
          id: string;
          itinerary_id: string;
          place_name: string;
          day: number;
          order: number;
          lat: number | null;
          lng: number | null;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          itinerary_id: string;
          place_name: string;
          day: number;
          order: number;
          lat?: number | null;
          lng?: number | null;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          itinerary_id?: string;
          place_name?: string;
          day?: number;
          order?: number;
          lat?: number | null;
          lng?: number | null;
          memo?: string | null;
          created_at?: string;
        };
      };
      places: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string | null;
          verification_score: number | null;
          tags: string[] | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          address?: string | null;
          verification_score?: number | null;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          address?: string | null;
          verification_score?: number | null;
          tags?: string[] | null;
        };
      };
    };
  };
}
