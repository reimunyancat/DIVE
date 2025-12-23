import { Router } from "express";
import {
  analyzeThemeController,
  generateScheduleController,
} from "../controllers/themeController";
import { validate } from "../middleware/validate";
import { themeSchema, scheduleSchema } from "../schemas";

const router = Router();

router.post("/analyze", validate(themeSchema), analyzeThemeController);
router.post("/schedule", validate(scheduleSchema), generateScheduleController);

export default router;
