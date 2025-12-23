import { Request, Response } from "express";
import { analyzeTheme, generateSchedule } from "../services/aiService";

export const analyzeThemeController = async (req: Request, res: Response) => {
  try {
    const { theme, location } = req.body;

    if (!theme || !location) {
      return res.status(400).json({ error: "Theme and location are required" });
    }

    const places = await analyzeTheme(theme, location);
    res.json({ success: true, data: places });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const generateScheduleController = async (
  req: Request,
  res: Response
) => {
  try {
    const { theme, location, duration } = req.body;

    if (!theme || !location || !duration) {
      return res
        .status(400)
        .json({ error: "Theme, location, and duration are required" });
    }

    const schedule = await generateSchedule(theme, location, duration);
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
