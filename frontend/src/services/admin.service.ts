import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type {
	AdminUserView,
	AuditLogFilters,
	AuditLogResponse,
	BlockUserPayload,
	CreateStaffPayload,
	RevenueSummary,
	SystemStats,
	UpdateUserRolePayload,
	UserDetailsResponse,
	UserListFilters,
	UserListResponse,
} from "@/types/admin.types";

const BASE = "api/admin";

interface SuccessResponse<T> {
	success: boolean;
	data: T;
}

interface MessageResponse {
	success: boolean;
	message: string;
}

export const AdminService = {
	// ─── Dashboard ─────────────────────────────────────────────
	getSystemStats: async (): Promise<SystemStats> => {
		const res = await apiGet<SuccessResponse<SystemStats>>(`${BASE}/stats`);
		return res.data;
	},

	getRecentBookings: async (limit = 10): Promise<Record<string, unknown>[]> => {
		const res = await apiGet<SuccessResponse<Record<string, unknown>[]>>(
			`${BASE}/recent-bookings?limit=${limit}`
		);
		return res.data;
	},

	getRevenueSummary: async (startDate: string, endDate: string): Promise<RevenueSummary> => {
		const res = await apiGet<SuccessResponse<RevenueSummary>>(
			`${BASE}/revenue-summary?start_date=${startDate}&end_date=${endDate}`
		);
		return res.data;
	},

	// ─── User Management ───────────────────────────────────────
	listUsers: async (filters: UserListFilters): Promise<UserListResponse> => {
		const params = new URLSearchParams();
		if (filters.role) params.set("role", filters.role);
		if (filters.account_status) params.set("account_status", filters.account_status);
		if (filters.search) params.set("search", filters.search);
		if (filters.page) params.set("page", String(filters.page));
		if (filters.limit) params.set("limit", String(filters.limit));
		const res = await apiGet<SuccessResponse<UserListResponse>>(
			`${BASE}/users?${params.toString()}`
		);
		return res.data;
	},

	getUserDetails: async (userId: string): Promise<UserDetailsResponse> => {
		const res = await apiGet<SuccessResponse<UserDetailsResponse>>(`${BASE}/users/${userId}`);
		return res.data;
	},

	createStaff: async (payload: CreateStaffPayload): Promise<AdminUserView> => {
		const res = await apiPost<SuccessResponse<AdminUserView>>(`${BASE}/users/staff`, payload);
		return res.data;
	},

	updateUserRole: async (userId: string, payload: UpdateUserRolePayload): Promise<void> => {
		await apiPatch<MessageResponse>(`${BASE}/users/${userId}/role`, payload);
	},

	blockUser: async (userId: string, payload: BlockUserPayload): Promise<void> => {
		await apiPost<MessageResponse>(`${BASE}/users/${userId}/block`, payload);
	},

	unblockUser: async (userId: string): Promise<void> => {
		await apiPost<MessageResponse>(`${BASE}/users/${userId}/unblock`, {});
	},

	deactivateUser: async (userId: string): Promise<void> => {
		await apiPost<MessageResponse>(`${BASE}/users/${userId}/deactivate`, {});
	},

	reactivateUser: async (userId: string): Promise<void> => {
		await apiPost<MessageResponse>(`${BASE}/users/${userId}/reactivate`, {});
	},

	getUserRestrictions: async (userId: string) => {
		const res = await apiGet<SuccessResponse<unknown[]>>(`${BASE}/users/${userId}/restrictions`);
		return res.data;
	},

	// ─── Audit Logs ────────────────────────────────────────────
	getAuditLogs: async (filters: AuditLogFilters): Promise<AuditLogResponse> => {
		const params = new URLSearchParams();
		if (filters.action_type) params.set("action_type", filters.action_type);
		if (filters.target_entity) params.set("target_entity", filters.target_entity);
		if (filters.admin_id) params.set("admin_id", filters.admin_id);
		if (filters.start_date) params.set("start_date", filters.start_date);
		if (filters.end_date) params.set("end_date", filters.end_date);
		if (filters.page) params.set("page", String(filters.page));
		if (filters.limit) params.set("limit", String(filters.limit));
		const res = await apiGet<SuccessResponse<AuditLogResponse>>(
			`${BASE}/audit-logs?${params.toString()}`
		);
		return res.data;
	},
};
