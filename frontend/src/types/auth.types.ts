export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponseData {
	accessToken: string;
	refreshToken: string;
	role: string;
	email?: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: LoginResponseData;
}

export interface VerifyOtpPayload {
	email: string;
	otp: string;
}

export interface VerifyOtpResponse {
	success: boolean;
	message: string;
	data: { verified: boolean };
}

export interface GenerateOtpPayload {
	email: string;
}

export interface GenerateOtpResponse {
	success: boolean;
	message: string;
	data: { expiresInSeconds: number };
}

export interface ResendOtpPayload {
	email: string;
}

export interface ResendOtpResponse {
	success: boolean;
	message: string;
	data: { expiresInSeconds: number };
}

export interface RegisterPayload {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	college_id: string;
	mobile: string;
	role: "user" | "admin";
	department: string;
}

export interface RegisterResponse {
	message: string;
}

export interface ForgotPasswordPayload {
	email: string;
}

export interface ForgotPasswordResponse {
	message: string;
}

export interface ResetPasswordPayload {
	password: string;
}

export interface ResetPasswordResponse {
	message: string;
}
