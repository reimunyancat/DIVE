import { Router } from "express";
import { verifyPlaceController } from "../controllers/verificationController";
import { validate } from "../middleware/validate";
import { verifySchema } from "../schemas";

const router = Router();

router.post("/", validate(verifySchema), verifyPlaceController);

export default router;
