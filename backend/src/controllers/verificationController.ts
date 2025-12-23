import { Request, Response } from "express";
import { verifyPlace } from "../services/verificationService";

export const verifyPlaceController = async (req: Request, res: Response) => {
  try {
    const { placeName } = req.body;

    if (!placeName) {
      return res.status(400).json({ error: "placeName is required" });
    }

    const result = await verifyPlace(placeName);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
