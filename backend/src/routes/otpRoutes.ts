import { Router } from "express";
import {
	generateOtpController,
	resendOtpController,
	verifyOtpController,
} from "../controllers/otpController";

const router = Router();

// POST /api/otp/generate — Generate OTP for email
router.post("/generate", generateOtpController);

// POST /api/otp/verify — Verify OTP
router.post("/verify", verifyOtpController);

// POST /api/otp/resend — Resend OTP
router.post("/resend", resendOtpController);

export default router;
