export interface RegisterUserRequest {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	college_id: string;
	mobile?: string;
	department?: string;
	role: string;
}

export interface UserDetails {
	email: string;
	role: string;
	college_id: string;
	first_name: string;
	last_name: string;
}

export interface UserProfile {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	college_id: string;
	mobile: string | null;
	department: string | null;
	role: string;
	account_status: string;
	wallet_balance: number;
	created_at: string;
}

export interface UpdateProfileRequest {
	first_name?: string;
	last_name?: string;
	mobile?: string;
	department?: string;
}

export const USER_ROLE = ["user", "staff", "admin"];
