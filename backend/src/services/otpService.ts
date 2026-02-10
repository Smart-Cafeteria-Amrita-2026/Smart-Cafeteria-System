import type { OtpEntry } from "../interfaces/otp.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";

// In-memory OTP store (keyed by email)
const otpStore = new Map<string, OtpEntry>();

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 120; // 2 minutes

/**
 * Generate a random numeric OTP of given length
 */
function generateOtpCode(length: number): string {
	let otp = "";
	for (let i = 0; i < length; i++) {
		otp += Math.floor(Math.random() * 10).toString();
	}
	return otp;
}

/**
 * Generate and store an OTP for the given email.
 * Prints to console in the format: <email> : <OTP>
 */
export const generateOtp = (email: string): ServiceResponse<{ expiresInSeconds: number }> => {
	const otp = generateOtpCode(OTP_LENGTH);
	const now = Date.now();
	const expiresAt = now + OTP_EXPIRY_SECONDS * 1000;

	const entry: OtpEntry = {
		otp,
		email,
		expiresAt,
		createdAt: now,
	};

	otpStore.set(email, entry);

	// Print OTP to backend console
	console.log(`${email} : ${otp}`);

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: { expiresInSeconds: OTP_EXPIRY_SECONDS },
	};
};

/**
 * Verify the OTP provided by the user
 */
export const verifyOtp = (email: string, otp: string): ServiceResponse<{ verified: boolean }> => {
	const entry = otpStore.get(email);

	if (!entry) {
		return {
			success: false,
			error: "No OTP found for this email. Please request a new one.",
			statusCode: STATUS.BADREQUEST,
		};
	}

	// Check expiration
	if (Date.now() > entry.expiresAt) {
		otpStore.delete(email);
		return {
			success: false,
			error: "OTP has expired. Please request a new one.",
			statusCode: STATUS.BADREQUEST,
		};
	}

	// Check OTP match
	if (entry.otp !== otp) {
		return {
			success: false,
			error: "Invalid OTP. Please try again.",
			statusCode: STATUS.BADREQUEST,
		};
	}

	// OTP is valid — remove it so it can't be reused
	otpStore.delete(email);

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: { verified: true },
	};
};

/**
 * Resend OTP — generates a fresh OTP for the email
 */
export const resendOtp = (email: string): ServiceResponse<{ expiresInSeconds: number }> => {
	// Remove any existing OTP
	otpStore.delete(email);

	// Generate a new one
	return generateOtp(email);
};
