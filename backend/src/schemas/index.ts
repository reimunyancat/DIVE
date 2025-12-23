import { z } from "zod";

export const themeSchema = z.object({
  body: z.object({
    theme: z.string().min(1, "Theme is required"),
    location: z.string().min(1, "Location is required"),
  }),
});

export const scheduleSchema = z.object({
  body: z.object({
    theme: z.string().min(1, "Theme is required"),
    location: z.string().min(1, "Location is required"),
    duration: z.string().min(1, "Duration is required"),
  }),
});

export const verifySchema = z.object({
  body: z.object({
    placeName: z.string().min(1, "Place name is required"),
  }),
});

export const routeSchema = z.object({
  body: z.object({
    start: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    end: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

export const itinerarySchema = z.object({
  body: z.object({
    userId: z.string().optional(), // Supabase Auth ID usually
    title: z.string().min(1, "Title is required"),
    theme: z.string().optional(),
    forkedFrom: z.string().optional(),
    items: z.array(
      z.object({
        place_name: z.string(),
        day: z.number(),
        order: z.number(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        memo: z.string().optional(),
      })
    ),
  }),
});
