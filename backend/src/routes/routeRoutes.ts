import { Router } from "express";
import { calculateRouteController } from "../controllers/routeController";
import { validate } from "../middleware/validate";
import { routeSchema } from "../schemas";

const router = Router();

router.post("/calculate", validate(routeSchema), calculateRouteController);

export default router;
