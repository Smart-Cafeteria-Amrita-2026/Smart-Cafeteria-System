import { z } from "zod";

const GOOGLE_EMAIL_REGEX = /^[a-zA-Z0-9.]+@gmail\.com$/;

export const generateOtpSchema = z.object({
	email: z.string().regex(GOOGLE_EMAIL_REGEX, "Provide valid email"),
});

export const verifyOtpSchema = z.object({
	email: z.string().regex(GOOGLE_EMAIL_REGEX, "Provide valid email"),
	otp: z
		.string()
		.length(6, "OTP must be exactly 6 digits")
		.regex(/^\d{6}$/, "OTP must be numeric"),
});

export const resendOtpSchema = z.object({
	email: z.string().regex(GOOGLE_EMAIL_REGEX, "Provide valid email"),
});
