import { apiPost } from "@/lib/api";
import type {
	LoginPayload,
	LoginResponse,
	VerifyOtpPayload,
	VerifyOtpResponse,
	RegisterPayload,
	RegisterResponse,
	ForgotPasswordPayload,
	ForgotPasswordResponse,
	ResetPasswordPayload,
	ResetPasswordResponse,
} from "../types/auth.types";

export const AuthService = {
	//  Login]
	login: (payload: LoginPayload): Promise<LoginResponse> =>
		apiPost<LoginResponse>("api/auth/signIn", payload, { skipAuth: true }),
	// logout]
	logout: (): Promise<{ message: string }> => apiPost<{ message: string }>("api/auth/signOut", {}),

	//  Verify OTP]
	verifyOtp: (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> =>
		apiPost<VerifyOtpResponse>("api/auth/verify-otp", payload),

	register: (payload: RegisterPayload): Promise<RegisterResponse> =>
		apiPost<RegisterResponse>("api/auth/register", payload, {
			skipAuth: true,
		}),

	//  Forgot password
	forgotPassword: (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> =>
		apiPost<ForgotPasswordResponse>("api/auth/forgot-password", payload, { skipAuth: true }),

	//  Reset password
	resetPassword: (payload: ResetPasswordPayload, token: string): Promise<ResetPasswordResponse> =>
		apiPost<ResetPasswordResponse>("api/auth/reset-password", payload, {
			skipAuth: true,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}),
};
