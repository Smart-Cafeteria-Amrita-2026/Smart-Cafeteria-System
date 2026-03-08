import { Router } from "express";
import { getTrendingItemsController } from "../controllers/forecastController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/trending-items", requireAuth, getTrendingItemsController);

export default router;
