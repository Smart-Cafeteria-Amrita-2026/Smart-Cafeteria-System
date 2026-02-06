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

export const USER_ROLE = ["user", "staff", "admin"];
