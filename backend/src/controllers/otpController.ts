import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import { generateOtp, resendOtp, verifyOtp } from "../services/otpService";
import { generateOtpSchema, resendOtpSchema, verifyOtpSchema } from "../validations/otp.schema";

/**
 * POST /api/otp/generate
 * Generate an OTP for the given email and print it to the console
 */
export const generateOtpController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = generateOtpSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.issues.map((i) => i.message).join(", ")}`,
			});
			return;
		}

		const result = generateOtp(validatedData.data.email);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "OTP generated successfully",
			data: { expiresInSeconds: result.data?.expiresInSeconds },
		});
	} catch (error) {
		console.error("Generate OTP Error:", error);
		res.status(STATUS.SERVERERROR).json({ success: false, message: "Internal Server Error" });
	}
};

/**
 * POST /api/otp/verify
 * Verify the OTP provided by the user
 */
export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = verifyOtpSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.issues.map((i) => i.message).join(", ")}`,
			});
			return;
		}

		const { email, otp } = validatedData.data;
		const result = verifyOtp(email, otp);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "OTP verified successfully",
			data: { verified: result.data?.verified },
		});
	} catch (error) {
		console.error("Verify OTP Error:", error);
		res.status(STATUS.SERVERERROR).json({ success: false, message: "Internal Server Error" });
	}
};

/**
 * POST /api/otp/resend
 * Resend a new OTP for the given email
 */
export const resendOtpController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = resendOtpSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.issues.map((i) => i.message).join(", ")}`,
			});
			return;
		}

		const result = resendOtp(validatedData.data.email);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "OTP resent successfully",
			data: { expiresInSeconds: result.data?.expiresInSeconds },
		});
	} catch (error) {
		console.error("Resend OTP Error:", error);
		res.status(STATUS.SERVERERROR).json({ success: false, message: "Internal Server Error" });
	}
};
