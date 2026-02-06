import { z } from "zod";

/* ===================== LOGIN ===================== */

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/* ===================== OTP ===================== */

export const otpSchema = z.object({
	otp: z.string().length(6, "OTP must be 6 digits"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

/* ===================== REGISTER ===================== */

export const registerSchema = z
	.object({
		email: z.string().email("Invalid email"),

		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(/[@$!%*?&#]/, "Password must contain at least one special character"),

		confirm_password: z.string(),

		first_name: z.string().min(1, "First name is required"),
		last_name: z.string().min(1, "Last name is required"),
		college_id: z.string().min(5, "College ID is required"),
		mobile: z.string().length(10, "Mobile number must be 10 digits"),
		role: z.literal("user"),
		department: z.string().min(2, "Department is required"),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;

/* ===================== FORGOT PASSWORD ===================== */

export const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
	.object({
		new_password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Must contain an uppercase letter")
			.regex(/[0-9]/, "Must contain a number")
			.regex(/[@$!%*?&#]/, "Must contain a special character"),

		confirm_password: z.string(),
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
