import { service_client } from "../config/supabase";
import type {
	AdminUserView,
	AuditLogEntry,
	AuditLogFilters,
	BlockUserRequest,
	CreateStaffRequest,
	RestrictionInfo,
	SystemStatsResponse,
	UserListFilters,
	UserListResponse,
} from "../interfaces/admin.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import { getCurrentISOStringIST, getCurrentDateStringIST } from "../utils/dateUtils";

// ─── Audit Logging Helper ────────────────────────────────────────────────────

async function logAuditAction(params: {
	adminId: string;
	actionType: string;
	targetEntity: string;
	targetId?: string;
	oldValue?: Record<string, unknown> | null;
	newValue?: Record<string, unknown> | null;
	description?: string;
	ipAddress?: string;
}): Promise<void> {
	await service_client.from("admin_audit_log").insert({
		admin_id: params.adminId,
		action_type: params.actionType,
		target_entity: params.targetEntity,
		target_id: params.targetId ?? null,
		old_value: params.oldValue ?? null,
		new_value: params.newValue ?? null,
		description: params.description ?? null,
		ip_address: params.ipAddress ?? null,
	});
}

// ─── Create Staff User ──────────────────────────────────────────────────────

export const createStaffUser = async (
	adminId: string,
	staffData: CreateStaffRequest,
	ipAddress?: string
): Promise<ServiceResponse<AdminUserView>> => {
	const { email, first_name, last_name, college_id, mobile, department } = staffData;

	// Check if user already exists in public.users by email
	const { data: existingUser } = await service_client
		.from("users")
		.select("id, email, role")
		.eq("email", email)
		.single();

	if (existingUser) {
		// If user exists but is not staff, upgrade their role
		if (existingUser.role === "staff" || existingUser.role === "admin") {
			return {
				success: false,
				error: `User already exists with role: ${existingUser.role}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		const { data: updatedUser, error: updateError } = await service_client
			.from("users")
			.update({ role: "staff", updated_at: getCurrentISOStringIST() })
			.eq("id", existingUser.id)
			.select("*")
			.single();

		if (updateError) {
			return { success: false, error: updateError.message, statusCode: STATUS.SERVERERROR };
		}

		await service_client.auth.admin.updateUserById(existingUser.id, {
			user_metadata: { role: "staff" },
		});

		await logAuditAction({
			adminId,
			actionType: "PROMOTE_TO_STAFF",
			targetEntity: "users",
			targetId: existingUser.id,
			oldValue: { role: existingUser.role },
			newValue: { role: "staff" },
			description: `Promoted existing user ${email} to staff`,
			ipAddress,
		});

		return { success: true, statusCode: STATUS.SUCCESS, data: updatedUser as AdminUserView };
	}

	// Create the user in Supabase Auth first (they'll complete OAuth on first login)
	const { data: authUser, error: authError } = await service_client.auth.admin.createUser({
		email,
		email_confirm: true,
		user_metadata: { first_name, last_name, college_id, role: "staff" },
	});

	if (authError) {
		return { success: false, error: authError.message, statusCode: STATUS.BADREQUEST };
	}

	// Create the public.users record
	const { data: newUser, error: insertError } = await service_client
		.from("users")
		.insert({
			id: authUser.user.id,
			email,
			first_name,
			last_name,
			college_id,
			mobile: mobile || null,
			department: department || null,
			role: "staff",
			account_status: "active",
			wallet_balance: 0.0,
		})
		.select("*")
		.single();

	if (insertError) {
		// Rollback: delete the auth user if public.users insert fails
		await service_client.auth.admin.deleteUser(authUser.user.id);
		return { success: false, error: insertError.message, statusCode: STATUS.BADREQUEST };
	}

	await logAuditAction({
		adminId,
		actionType: "CREATE_STAFF",
		targetEntity: "users",
		targetId: authUser.user.id,
		newValue: { email, first_name, last_name, college_id, role: "staff" },
		description: `Created staff user: ${email}`,
		ipAddress,
	});

	return { success: true, statusCode: STATUS.CREATED, data: newUser as AdminUserView };
};

// ─── List Users ──────────────────────────────────────────────────────────────

export const listUsers = async (
	filters: UserListFilters
): Promise<ServiceResponse<UserListResponse>> => {
	const { role, account_status, search, page = 1, limit = 20 } = filters;
	const offset = (page - 1) * limit;

	let query = service_client
		.from("users")
		.select(
			"id, email, first_name, last_name, college_id, mobile, department, role, is_active, account_status, wallet_balance, created_at, updated_at",
			{ count: "exact" }
		);

	if (role) {
		query = query.eq("role", role);
	}
	if (account_status) {
		query = query.eq("account_status", account_status);
	}
	if (search) {
		query = query.or(
			`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,college_id.ilike.%${search}%`
		);
	}

	const { data, error, count } = await query
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		return { success: false, error: error.message, statusCode: STATUS.SERVERERROR };
	}

	const total = count ?? 0;

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: {
			users: (data ?? []) as AdminUserView[],
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

// ─── Get Single User Details ─────────────────────────────────────────────────

export const getUserDetails = async (
	userId: string
): Promise<ServiceResponse<AdminUserView & { restrictions: RestrictionInfo[] }>> => {
	const { data: user, error } = await service_client
		.from("users")
		.select(
			"id, email, first_name, last_name, college_id, mobile, department, role, is_active, account_status, wallet_balance, created_at, updated_at"
		)
		.eq("id", userId)
		.single();

	if (error) {
		return { success: false, error: "User not found", statusCode: STATUS.NOTFOUND };
	}

	// Fetch active restrictions
	const { data: restrictions } = await service_client
		.from("user_restrictions")
		.select("*")
		.eq("user_id", userId)
		.eq("is_active", true)
		.order("created_at", { ascending: false });

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: {
			...(user as AdminUserView),
			restrictions: (restrictions ?? []) as RestrictionInfo[],
		},
	};
};

// ─── Block User ──────────────────────────────────────────────────────────────

export const blockUser = async (
	adminId: string,
	targetUserId: string,
	blockData: BlockUserRequest,
	ipAddress?: string
): Promise<ServiceResponse<void>> => {
	// Prevent blocking yourself
	if (adminId === targetUserId) {
		return {
			success: false,
			error: "Cannot block your own account",
			statusCode: STATUS.BADREQUEST,
		};
	}

	// Check target user exists and get current status
	const { data: targetUser, error: userError } = await service_client
		.from("users")
		.select("id, email, role, account_status")
		.eq("id", targetUserId)
		.single();

	if (userError || !targetUser) {
		return { success: false, error: "User not found", statusCode: STATUS.NOTFOUND };
	}

	// Prevent blocking other admins
	if (targetUser.role === "admin") {
		return { success: false, error: "Cannot block an admin account", statusCode: STATUS.FORBIDDEN };
	}

	if (targetUser.account_status === "blocked") {
		return { success: false, error: "User is already blocked", statusCode: STATUS.BADREQUEST };
	}

	// Update user status
	const { error: updateError } = await service_client
		.from("users")
		.update({
			account_status: "blocked",
			is_active: false,
			updated_at: getCurrentISOStringIST(),
		})
		.eq("id", targetUserId);

	if (updateError) {
		return { success: false, error: updateError.message, statusCode: STATUS.SERVERERROR };
	}

	// Create restriction record
	await service_client.from("user_restrictions").insert({
		user_id: targetUserId,
		type: "block",
		reason: blockData.reason,
		start_date: getCurrentISOStringIST(),
		end_date: blockData.end_date || null,
		is_active: true,
		applied_by: adminId,
	});

	await logAuditAction({
		adminId,
		actionType: "BLOCK_USER",
		targetEntity: "users",
		targetId: targetUserId,
		oldValue: { account_status: targetUser.account_status },
		newValue: { account_status: "blocked", reason: blockData.reason },
		description: `Blocked user ${targetUser.email}: ${blockData.reason}`,
		ipAddress,
	});

	return { success: true, statusCode: STATUS.SUCCESS };
};

// ─── Unblock User ────────────────────────────────────────────────────────────

export const unblockUser = async (
	adminId: string,
	targetUserId: string,
	ipAddress?: string
): Promise<ServiceResponse<void>> => {
	const { data: targetUser, error: userError } = await service_client
		.from("users")
		.select("id, email, account_status")
		.eq("id", targetUserId)
		.single();

	if (userError || !targetUser) {
		return { success: false, error: "User not found", statusCode: STATUS.NOTFOUND };
	}

	if (targetUser.account_status !== "blocked") {
		return { success: false, error: "User is not blocked", statusCode: STATUS.BADREQUEST };
	}

	const { error: updateError } = await service_client
		.from("users")
		.update({
			account_status: "active",
			is_active: true,
			updated_at: getCurrentISOStringIST(),
		})
		.eq("id", targetUserId);

	if (updateError) {
		return { success: false, error: updateError.message, statusCode: STATUS.SERVERERROR };
	}

	// Deactivate all active restrictions for this user
	await service_client
		.from("user_restrictions")
		.update({ is_active: false, end_date: getCurrentISOStringIST() })
		.eq("user_id", targetUserId)
		.eq("is_active", true);

	await logAuditAction({
		adminId,
		actionType: "UNBLOCK_USER",
		targetEntity: "users",
		targetId: targetUserId,
		oldValue: { account_status: "blocked" },
		newValue: { account_status: "active" },
		description: `Unblocked user ${targetUser.email}`,
		ipAddress,
	});

	return { success: true, statusCode: STATUS.SUCCESS };
};

// ─── Update User Role ────────────────────────────────────────────────────────

export const updateUserRole = async (
	adminId: string,
	targetUserId: string,
	newRole: string,
	ipAddress?: string
): Promise<ServiceResponse<void>> => {
	if (adminId === targetUserId) {
		return { success: false, error: "Cannot change your own role", statusCode: STATUS.BADREQUEST };
	}

	const { data: targetUser, error: userError } = await service_client
		.from("users")
		.select("id, email, role")
		.eq("id", targetUserId)
		.single();

	if (userError || !targetUser) {
		return { success: false, error: "User not found", statusCode: STATUS.NOTFOUND };
	}

	if (targetUser.role === newRole) {
		return {
			success: false,
			error: `User already has role: ${newRole}`,
			statusCode: STATUS.BADREQUEST,
		};
	}

	const { error: updateError } = await service_client
		.from("users")
		.update({ role: newRole, updated_at: getCurrentISOStringIST() })
		.eq("id", targetUserId);

	if (updateError) {
		return { success: false, error: updateError.message, statusCode: STATUS.SERVERERROR };
	}

	await service_client.auth.admin.updateUserById(targetUserId, {
		user_metadata: { role: newRole },
	});

	await logAuditAction({
		adminId,
		actionType: "UPDATE_ROLE",
		targetEntity: "users",
		targetId: targetUserId,
		oldValue: { role: targetUser.role },
		newValue: { role: newRole },
		description: `Changed role of ${targetUser.email} from ${targetUser.role} to ${newRole}`,
		ipAddress,
	});

	return { success: true, statusCode: STATUS.SUCCESS };
};

// ─── System Dashboard Stats ──────────────────────────────────────────────────

export const getSystemStats = async (): Promise<ServiceResponse<SystemStatsResponse>> => {
	const today = getCurrentDateStringIST();

	const [
		usersResult,
		activeUsersResult,
		blockedUsersResult,
		staffResult,
		adminResult,
		bookingsTodayResult,
		revenueTodayResult,
		activeSlotsResult,
		lowStockResult,
		openIssuesResult,
	] = await Promise.all([
		service_client.from("users").select("id", { count: "exact", head: true }),
		service_client
			.from("users")
			.select("id", { count: "exact", head: true })
			.eq("account_status", "active"),
		service_client
			.from("users")
			.select("id", { count: "exact", head: true })
			.eq("account_status", "blocked"),
		service_client.from("users").select("id", { count: "exact", head: true }).eq("role", "staff"),
		service_client.from("users").select("id", { count: "exact", head: true }).eq("role", "admin"),
		service_client
			.from("bookings")
			.select("booking_id", { count: "exact", head: true })
			.gte("created_at", `${today}T00:00:00`)
			.lte("created_at", `${today}T23:59:59`),
		service_client
			.from("booking_payments")
			.select("amount")
			.gte("created_at", `${today}T00:00:00`)
			.lte("created_at", `${today}T23:59:59`),
		service_client
			.from("meal_slots")
			.select("slot_id", { count: "exact", head: true })
			.eq("slot_date", today)
			.eq("is_active", true),
		service_client
			.from("ingredients")
			.select("ingredient_id", { count: "exact", head: true })
			.filter("current_quantity", "lte", "minimum_threshold"),
		service_client
			.from("feedback_issues")
			.select("issue_id", { count: "exact", head: true })
			.eq("status", "open"),
	]);

	const totalRevenue = (revenueTodayResult.data ?? []).reduce(
		(sum: number, r: { amount: number }) => sum + Number(r.amount),
		0
	);

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: {
			totalUsers: usersResult.count ?? 0,
			activeUsers: activeUsersResult.count ?? 0,
			blockedUsers: blockedUsersResult.count ?? 0,
			staffCount: staffResult.count ?? 0,
			adminCount: adminResult.count ?? 0,
			totalBookingsToday: bookingsTodayResult.count ?? 0,
			totalRevenue,
			activeSlots: activeSlotsResult.count ?? 0,
			lowStockIngredients: lowStockResult.count ?? 0,
			openFeedbackIssues: openIssuesResult.count ?? 0,
		},
	};
};

// ─── Audit Log ───────────────────────────────────────────────────────────────

export const getAuditLogs = async (
	filters: AuditLogFilters
): Promise<
	ServiceResponse<{
		logs: AuditLogEntry[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}>
> => {
	const {
		action_type,
		target_entity,
		admin_id,
		start_date,
		end_date,
		page = 1,
		limit = 20,
	} = filters;
	const offset = (page - 1) * limit;

	let query = service_client
		.from("admin_audit_log")
		.select("*, users!admin_audit_log_admin_id_fkey(email, first_name, last_name)", {
			count: "exact",
		});

	if (action_type) query = query.eq("action_type", action_type);
	if (target_entity) query = query.eq("target_entity", target_entity);
	if (admin_id) query = query.eq("admin_id", admin_id);
	if (start_date) query = query.gte("created_at", start_date);
	if (end_date) query = query.lte("created_at", end_date);

	const { data, error, count } = await query
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		return { success: false, error: error.message, statusCode: STATUS.SERVERERROR };
	}

	const logs = (data ?? []).map((entry: Record<string, unknown>) => {
		const user = entry.users as { email: string; first_name: string; last_name: string } | null;
		return {
			audit_id: entry.audit_id,
			admin_id: entry.admin_id,
			action_type: entry.action_type,
			target_entity: entry.target_entity,
			target_id: entry.target_id,
			old_value: entry.old_value,
			new_value: entry.new_value,
			description: entry.description,
			ip_address: entry.ip_address,
			created_at: entry.created_at,
			admin_email: user?.email ?? null,
			admin_name: user ? `${user.first_name} ${user.last_name}` : null,
		};
	}) as AuditLogEntry[];

	const total = count ?? 0;

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: {
			logs,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

// ─── Delete User (Soft) ─────────────────────────────────────────────────────

export const deactivateUser = async (
	adminId: string,
	targetUserId: string,
	ipAddress?: string
): Promise<ServiceResponse<void>> => {
	if (adminId === targetUserId) {
		return {
			success: false,
			error: "Cannot deactivate your own account",
			statusCode: STATUS.BADREQUEST,
		};
	}

	const { data: targetUser, error: userError } = await service_client
		.from("users")
		.select("id, email, role, is_active")
		.eq("id", targetUserId)
		.single();

	if (userError || !targetUser) {
		return { success: false, error: "User not found", statusCode: STATUS.NOTFOUND };
	}

	if (targetUser.role === "admin") {
		return {
			success: false,
			error: "Cannot deactivate an admin account",
			statusCode: STATUS.FORBIDDEN,
		};
	}

	if (!targetUser.is_active) {
		return { success: false, error: "User is already deactivated", statusCode: STATUS.BADREQUEST };
	}

	const { error: updateError } = await service_client
		.from("users")
		.update({
			is_active: false,
			account_status: "suspended",
			updated_at: getCurrentISOStringIST(),
		})
		.eq("id", targetUserId);

	if (updateError) {
		return { success: false, error: updateError.message, statusCode: STATUS.SERVERERROR };
	}

	await logAuditAction({
		adminId,
		actionType: "DEACTIVATE_USER",
		targetEntity: "users",
		targetId: targetUserId,
		oldValue: { is_active: true },
		newValue: { is_active: false, account_status: "suspended" },
		description: `Deactivated user ${targetUser.email}`,
		ipAddress,
	});

	return { success: true, statusCode: STATUS.SUCCESS };
};

// ─── Reactivate User ─────────────────────────────────────────────────────────

export const reactivateUser = async (
	adminId: string,
	targetUserId: string,
	ipAddress?: string
): Promise<ServiceResponse<void>> => {
	const { data: targetUser, error: userError } = await service_client
		.from("users")
		.select("id, email, is_active, account_status")
		.eq("id", targetUserId)
		.single();

	if (userError || !targetUser) {
		return { success: false, error: "User not found", statusCode: STATUS.NOTFOUND };
	}

	if (targetUser.is_active && targetUser.account_status === "active") {
		return { success: false, error: "User is already active", statusCode: STATUS.BADREQUEST };
	}

	const { error: updateError } = await service_client
		.from("users")
		.update({
			is_active: true,
			account_status: "active",
			updated_at: getCurrentISOStringIST(),
		})
		.eq("id", targetUserId);

	if (updateError) {
		return { success: false, error: updateError.message, statusCode: STATUS.SERVERERROR };
	}

	// Deactivate any active restrictions
	await service_client
		.from("user_restrictions")
		.update({ is_active: false, end_date: getCurrentISOStringIST() })
		.eq("user_id", targetUserId)
		.eq("is_active", true);

	await logAuditAction({
		adminId,
		actionType: "REACTIVATE_USER",
		targetEntity: "users",
		targetId: targetUserId,
		oldValue: { is_active: targetUser.is_active, account_status: targetUser.account_status },
		newValue: { is_active: true, account_status: "active" },
		description: `Reactivated user ${targetUser.email}`,
		ipAddress,
	});

	return { success: true, statusCode: STATUS.SUCCESS };
};

// ─── Recent Activity (Bookings, Payments, etc.) ──────────────────────────────

export const getRecentBookings = async (
	limit = 10
): Promise<ServiceResponse<Record<string, unknown>[]>> => {
	const { data, error } = await service_client
		.from("bookings")
		.select(
			"booking_id, booking_reference, booking_status, total_amount, booking_type, created_at, users!bookings_primary_user_id_fkey(email, first_name, last_name), meal_slots!bookings_slot_id_fkey(slot_name, slot_date)"
		)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return { success: false, error: error.message, statusCode: STATUS.SERVERERROR };
	}

	return { success: true, statusCode: STATUS.SUCCESS, data: data as Record<string, unknown>[] };
};

// ─── User Restrictions History ───────────────────────────────────────────────

export const getUserRestrictions = async (
	userId: string
): Promise<ServiceResponse<RestrictionInfo[]>> => {
	const { data, error } = await service_client
		.from("user_restrictions")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		return { success: false, error: error.message, statusCode: STATUS.SERVERERROR };
	}

	return { success: true, statusCode: STATUS.SUCCESS, data: (data ?? []) as RestrictionInfo[] };
};

// ─── Revenue Summary ─────────────────────────────────────────────────────────

export const getRevenueSummary = async (
	startDate: string,
	endDate: string
): Promise<
	ServiceResponse<{
		totalRevenue: number;
		totalTopups: number;
		totalBookings: number;
		averageOrderValue: number;
	}>
> => {
	const [paymentsResult, topupsResult, bookingsResult] = await Promise.all([
		service_client
			.from("booking_payments")
			.select("amount")
			.gte("created_at", startDate)
			.lte("created_at", endDate),
		service_client
			.from("wallet_topups")
			.select("amount")
			.gte("created_at", startDate)
			.lte("created_at", endDate),
		service_client
			.from("bookings")
			.select("booking_id, total_amount")
			.gte("created_at", startDate)
			.lte("created_at", endDate)
			.neq("booking_status", "cancelled"),
	]);

	const totalRevenue = (paymentsResult.data ?? []).reduce(
		(sum: number, r: { amount: number }) => sum + Number(r.amount),
		0
	);
	const totalTopups = (topupsResult.data ?? []).reduce(
		(sum: number, r: { amount: number }) => sum + Number(r.amount),
		0
	);
	const totalBookings = bookingsResult.data?.length ?? 0;
	const averageOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

	return {
		success: true,
		statusCode: STATUS.SUCCESS,
		data: { totalRevenue, totalTopups, totalBookings, averageOrderValue },
	};
};
