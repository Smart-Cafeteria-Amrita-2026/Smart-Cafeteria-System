export interface OtpEntry {
	otp: string;
	email: string;
	expiresAt: number; // Unix timestamp in ms
	createdAt: number;
}

export interface GenerateOtpRequest {
	email: string;
}

export interface GenerateOtpResponse {
	message: string;
	expiresInSeconds: number;
}

export interface VerifyOtpRequest {
	email: string;
	otp: string;
}

export interface VerifyOtpResponse {
	message: string;
	verified: boolean;
}

export interface ResendOtpRequest {
	email: string;
}

export interface ResendOtpResponse {
	message: string;
	expiresInSeconds: number;
}
