import { supabase } from "../config/supabase";

export interface ItineraryItem {
  place_name: string;
  day: number;
  order: number;
  lat?: number;
  lng?: number;
  memo?: string;
}

export const saveItinerary = async (
  userId: string,
  title: string,
  items: ItineraryItem[],
  theme?: string,
  forkedFrom?: string
) => {
  const { data: itinerary, error: itineraryError } = await supabase
    .from("itineraries")
    .insert([
      {
        user_id: userId,
        title: title,
        is_public: true,
        theme: theme,
        forked_from: forkedFrom,
      },
    ])
    .select()
    .single();

  if (itineraryError) throw itineraryError;

  const itemsWithId = items.map((item) => ({
    ...item,
    itinerary_id: itinerary.id,
  }));

  const { error: itemsError } = await supabase
    .from("itinerary_items")
    .insert(itemsWithId);

  if (itemsError) throw itemsError;

  return itinerary;
};

export const getItinerary = async (id: string) => {
  const { data, error } = await supabase
    .from("itineraries")
    .select(
      `
      *,
      itinerary_items (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
