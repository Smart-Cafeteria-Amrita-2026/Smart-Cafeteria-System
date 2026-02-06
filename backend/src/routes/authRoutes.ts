import { Router } from "express";
import {
	forgotPassword,
	logoutUser,
	registerUser,
	signInUser,
	testRoute,
	updatePassword,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/test", testRoute);
router.post("/register", registerUser);
router.post("/signIn", signInUser);
router.post("/signOut", requireAuth, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", updatePassword);

export default router;
