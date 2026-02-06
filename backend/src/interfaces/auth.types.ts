export interface SignInRequest {
	email: string;
	password: string;
}

export interface signInResponse {
	accessToken: string;
	refreshToken: string;
	role: string;
	email: string | undefined;
}
