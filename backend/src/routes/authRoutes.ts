import { Router } from "express";
import {
	forgotPassword,
	getProfile,
	logoutUser,
	registerUser,
	signInUser,
	testRoute,
	updatePassword,
	updateProfile,
} from "../controllers/authController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/test", testRoute);
router.post("/register", registerUser);
router.post("/signIn", signInUser);
router.post("/signOut", requireAuth, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", updatePassword);
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);

export default router;
