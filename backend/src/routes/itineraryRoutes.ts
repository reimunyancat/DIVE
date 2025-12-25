import { Router } from "express";
import {
  createItineraryController,
  getItineraryController,
  getUserItinerariesController,
} from "../controllers/itineraryController";
import { validate } from "../middleware/validate";
import { itinerarySchema } from "../schemas";

const router = Router();

router.post("/", validate(itinerarySchema), createItineraryController);
router.get("/user/:userId", getUserItinerariesController); // 순서 중요! :id보다 먼저 와야 함
router.get("/:id", getItineraryController);

export default router;
