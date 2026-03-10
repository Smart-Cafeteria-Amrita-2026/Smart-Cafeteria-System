import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	blockUser,
	createStaffUser,
	deactivateUser,
	getAuditLogs,
	getRecentBookings,
	getRevenueSummary,
	getSystemStats,
	getUserDetails,
	getUserRestrictions,
	listUsers,
	reactivateUser,
	unblockUser,
	updateUserRole,
} from "../services/adminService";
import {
	auditLogQuerySchema,
	blockUserSchema,
	createStaffSchema,
	updateUserRoleSchema,
	userListQuerySchema,
} from "../validations/admin.schema";

// ─── Create Staff User ──────────────────────────────────────────────────────

export const createStaffController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const validated = createStaffSchema.safeParse(req.body);
		if (!validated.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validated.error}` });
			return;
		}

		const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
		const result = await createStaffUser(req.user.id, validated.data, ipAddress);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("Create Staff Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── List Users ──────────────────────────────────────────────────────────────

export const listUsersController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validated = userListQuerySchema.safeParse(req.query);
		if (!validated.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validated.error}` });
			return;
		}

		const result = await listUsers(validated.data);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("List Users Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Get User Details ────────────────────────────────────────────────────────

export const getUserDetailsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const result = await getUserDetails(userId);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("Get User Details Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Block User ──────────────────────────────────────────────────────────────

export const blockUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const validated = blockUserSchema.safeParse(req.body);
		if (!validated.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validated.error}` });
			return;
		}

		const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
		const result = await blockUser(req.user.id, userId, validated.data, ipAddress);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, message: "User blocked successfully" });
	} catch (error) {
		console.error("Block User Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Unblock User ────────────────────────────────────────────────────────────

export const unblockUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
		const result = await unblockUser(req.user.id, userId, ipAddress);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, message: "User unblocked successfully" });
	} catch (error) {
		console.error("Unblock User Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Update User Role ────────────────────────────────────────────────────────

export const updateUserRoleController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const validated = updateUserRoleSchema.safeParse(req.body);
		if (!validated.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validated.error}` });
			return;
		}

		const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
		const result = await updateUserRole(req.user.id, userId, validated.data.role, ipAddress);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res
			.status(result.statusCode)
			.json({ success: true, message: "User role updated successfully" });
	} catch (error) {
		console.error("Update Role Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Deactivate User ─────────────────────────────────────────────────────────

export const deactivateUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
		const result = await deactivateUser(req.user.id, userId, ipAddress);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, message: "User deactivated successfully" });
	} catch (error) {
		console.error("Deactivate User Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Reactivate User ─────────────────────────────────────────────────────────

export const reactivateUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
			return;
		}

		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
		const result = await reactivateUser(req.user.id, userId, ipAddress);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, message: "User reactivated successfully" });
	} catch (error) {
		console.error("Reactivate User Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── System Stats ────────────────────────────────────────────────────────────

export const getSystemStatsController = async (_req: Request, res: Response): Promise<void> => {
	try {
		const result = await getSystemStats();

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("System Stats Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export const getAuditLogsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validated = auditLogQuerySchema.safeParse(req.query);
		if (!validated.success) {
			res.status(STATUS.BADREQUEST).json({ error: `Validation Error: ${validated.error}` });
			return;
		}

		const result = await getAuditLogs(validated.data);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("Audit Logs Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Recent Bookings ─────────────────────────────────────────────────────────

export const getRecentBookingsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const limit = Number(req.query.limit) || 10;
		const result = await getRecentBookings(limit);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("Recent Bookings Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── Revenue Summary ─────────────────────────────────────────────────────────

export const getRevenueSummaryController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { start_date, end_date } = req.query;

		if (!start_date || !end_date) {
			res.status(STATUS.BADREQUEST).json({ error: "start_date and end_date are required" });
			return;
		}

		const result = await getRevenueSummary(start_date as string, end_date as string);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("Revenue Summary Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};

// ─── User Restrictions ───────────────────────────────────────────────────────

export const getUserRestrictionsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.params.userId as string;
		if (!userId) {
			res.status(STATUS.BADREQUEST).json({ error: "User ID is required" });
			return;
		}

		const result = await getUserRestrictions(userId);

		if (!result.success) {
			res.status(result.statusCode).json({ success: false, error: result.error });
			return;
		}

		res.status(result.statusCode).json({ success: true, data: result.data });
	} catch (error) {
		console.error("User Restrictions Error:", error);
		res.status(STATUS.SERVERERROR).json({ error: "Internal Server Error" });
	}
};
