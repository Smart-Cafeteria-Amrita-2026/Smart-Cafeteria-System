export interface CreateStaffRequest {
	email: string;
	first_name: string;
	last_name: string;
	college_id: string;
	mobile?: string;
	department?: string;
}

export interface UserListFilters {
	role?: string;
	account_status?: string;
	search?: string;
	page?: number;
	limit?: number;
}

export interface UserListResponse {
	users: AdminUserView[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface AdminUserView {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	college_id: string;
	mobile: string | null;
	department: string | null;
	role: string;
	is_active: boolean;
	account_status: string;
	wallet_balance: number;
	created_at: string;
	updated_at: string;
}

export interface BlockUserRequest {
	reason: string;
	end_date?: string; // ISO string, null = permanent
}

export interface UpdateUserRoleRequest {
	role: "user" | "staff" | "admin";
}

export interface SystemStatsResponse {
	totalUsers: number;
	activeUsers: number;
	blockedUsers: number;
	staffCount: number;
	adminCount: number;
	totalBookingsToday: number;
	totalRevenue: number;
	activeSlots: number;
	lowStockIngredients: number;
	openFeedbackIssues: number;
}

export interface AuditLogEntry {
	audit_id: string;
	admin_id: string;
	action_type: string;
	target_entity: string;
	target_id: string | null;
	old_value: Record<string, unknown> | null;
	new_value: Record<string, unknown> | null;
	description: string | null;
	ip_address: string | null;
	created_at: string;
	admin_email?: string;
	admin_name?: string;
}

export interface AuditLogFilters {
	action_type?: string;
	target_entity?: string;
	admin_id?: string;
	start_date?: string;
	end_date?: string;
	page?: number;
	limit?: number;
}

export interface RestrictionInfo {
	restriction_id: number;
	user_id: string;
	type: string;
	reason: string;
	no_show_count: number;
	start_date: string;
	end_date: string | null;
	is_active: boolean;
	applied_by: string | null;
	created_at: string;
}
