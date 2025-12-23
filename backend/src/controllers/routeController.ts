import { Request, Response } from "express";
import { calculateRoute } from "../services/routeService";

export const calculateRouteController = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;

    if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
      return res
        .status(400)
        .json({ error: "Start and end coordinates (lat, lng) are required" });
    }

    const result = await calculateRoute(start, end);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
