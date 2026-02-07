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

export interface UpdateProfilePayload {
	first_name?: string;
	last_name?: string;
	mobile?: string;
	department?: string;
}

export interface ProfileResponse {
	success: boolean;
	data: UserProfile;
	message?: string;
}
