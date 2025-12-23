import { Router } from "express";
import {
  createItineraryController,
  getItineraryController,
} from "../controllers/itineraryController";
import { validate } from "../middleware/validate";
import { itinerarySchema } from "../schemas";

const router = Router();

router.post("/", validate(itinerarySchema), createItineraryController);
router.get("/:id", getItineraryController);

export default router;
