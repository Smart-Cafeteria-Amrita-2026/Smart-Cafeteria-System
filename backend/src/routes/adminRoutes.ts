import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import {
	blockUserController,
	createStaffController,
	deactivateUserController,
	getAuditLogsController,
	getRecentBookingsController,
	getRevenueSummaryController,
	getSystemStatsController,
	getUserDetailsController,
	getUserRestrictionsController,
	listUsersController,
	reactivateUserController,
	unblockUserController,
	updateUserRoleController,
} from "../controllers/adminController";

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireAdmin);

// ─── Dashboard ───────────────────────────────────────────────────────────────
router.get("/stats", getSystemStatsController);
router.get("/recent-bookings", getRecentBookingsController);
router.get("/revenue-summary", getRevenueSummaryController);

// ─── User Management ─────────────────────────────────────────────────────────
router.get("/users", listUsersController);
router.get("/users/:userId", getUserDetailsController);
router.post("/users/staff", createStaffController);
router.patch("/users/:userId/role", updateUserRoleController);
router.post("/users/:userId/block", blockUserController);
router.post("/users/:userId/unblock", unblockUserController);
router.post("/users/:userId/deactivate", deactivateUserController);
router.post("/users/:userId/reactivate", reactivateUserController);
router.get("/users/:userId/restrictions", getUserRestrictionsController);

// ─── Audit Logs ──────────────────────────────────────────────────────────────
router.get("/audit-logs", getAuditLogsController);

export default router;
