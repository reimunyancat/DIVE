import { Request, Response } from "express";
import {
  saveItinerary,
  getItinerary,
  getUserItineraries,
} from "../services/itineraryService";

export const createItineraryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, title, items, theme, forkedFrom } = req.body;
    const result = await saveItinerary(userId, title, items, theme, forkedFrom);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getItineraryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getItinerary(id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserItinerariesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const result = await getUserItineraries(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
