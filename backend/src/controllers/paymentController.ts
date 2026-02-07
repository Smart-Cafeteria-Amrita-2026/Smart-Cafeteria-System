import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	assignWalkInMeal,
	confirmStripePayment,
	confirmWalletRecharge,
	contributeToBookingWallet,
	createPaymentIntent,
	createWalletRechargeSession,
	detectLeftoverFood,
	extendPaymentWindow,
	getBookingWalletContributions,
	getCheckoutSessionStatus,
	getNoShowFrequencyReport,
	getPaymentWindowStatus,
	getUnusedMealsReport,
	getUnusedSlotsReport,
	getWalkInAvailableMeals,
	getWalletBalance,
	getWalletTransactions,
	handleStripeWebhook,
	processExpiredPaymentWindows,
	processNoShows,
	settleBill,
	transferLeftoverToNextSlot,
	updateWalkInInventoryFromNoShows,
} from "../services/paymentService";
import {
	assignWalkInMealSchema,
	bookingIdParamSchema,
	confirmPaymentSchema,
	confirmWalletRechargeSchema,
	createPaymentIntentSchema,
	createWalletRechargeIntentSchema,
	extendPaymentWindowSchema,
	getLeftoverFoodsQuerySchema,
	getWalkInMealsQuerySchema,
	noShowReportQuerySchema,
	slotIdParamSchema,
	transferLeftoverFoodsSchema,
	unusedMealsReportQuerySchema,
	unusedSlotsReportQuerySchema,
	walletContributionSchema,
} from "../validations/payment.schema";

// ============================================
// Payment Window Controllers
// ============================================

/**
 * GET /api/payments/window/:bookingId
 * FR-2.3.8: Get payment window status for a booking
 */
export const getPaymentWindowController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const paramValidation = bookingIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid booking ID",
			});
			return;
		}

		const bookingId = parseInt(paramValidation.data.bookingId, 10);
		const result = await getPaymentWindowStatus(req.token, req.user.id, bookingId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Payment window status retrieved successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/payments/window/:bookingId/extend
 * FR-2.3.15: Extend payment window (admin only)
 */
export const extendPaymentWindowController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is admin
		if (req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only administrators can extend payment windows",
			});
			return;
		}

		const paramValidation = bookingIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid booking ID",
			});
			return;
		}

		const validatedData = extendPaymentWindowSchema.safeParse({
			booking_id: parseInt(paramValidation.data.bookingId, 10),
			...req.body,
		});

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await extendPaymentWindow(
			req.user.id,
			validatedData.data.booking_id,
			validatedData.data.extension_minutes
		);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Payment window extended successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Booking Wallet Controllers
// ============================================

/**
 * POST /api/payments/wallet/contribute
 * FR-2.3.10, FR-2.3.11: Contribute to booking wallet
 */
export const contributeToWalletController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = walletContributionSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await contributeToBookingWallet(req.token, req.user.id, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Contribution successful",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/payments/wallet/:bookingId/contributions
 * Get all contributions to a booking wallet
 */
export const getWalletContributionsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const paramValidation = bookingIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid booking ID",
			});
			return;
		}

		const bookingId = parseInt(paramValidation.data.bookingId, 10);
		const result = await getBookingWalletContributions(req.token, req.user.id, bookingId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Wallet contributions retrieved successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Bill Settlement Controllers
// ============================================

/**
 * POST /api/payments/settle/:bookingId
 * FR-2.3.12: Settle bill using wallet balance
 */
export const settleBillController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const paramValidation = bookingIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid booking ID",
			});
			return;
		}

		const bookingId = parseInt(paramValidation.data.bookingId, 10);
		const result = await settleBill(req.token, req.user.id, bookingId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Bill settled successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Stripe Payment Controllers
// ============================================

/**
 * POST /api/payments/stripe/create-intent
 * Create a Stripe payment intent
 */
export const createPaymentIntentController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = createPaymentIntentSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await createPaymentIntent(req.token, req.user.id, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Payment intent created successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/payments/stripe/confirm
 * Confirm a Stripe payment
 */
export const confirmPaymentController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = confirmPaymentSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await confirmStripePayment(req.token, req.user.id, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Payment confirmed successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/payments/stripe/webhook
 * Handle Stripe webhook events
 */
export const stripeWebhookController = async (req: Request, res: Response): Promise<void> => {
	try {
		const signature = req.headers["stripe-signature"] as string;

		if (!signature) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Missing stripe-signature header",
			});
			return;
		}

		// Note: req.body should be the raw body for webhook signature verification
		const result = await handleStripeWebhook(req.body, signature);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json(result.data);
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Webhook Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Personal Wallet Controllers
// ============================================

/**
 * POST /api/payments/personal-wallet/create-session
 * Create a Stripe Checkout Session for recharging personal wallet (embedded UI mode)
 */
export const createWalletRechargeSessionController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = createWalletRechargeIntentSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await createWalletRechargeSession(
			req.token,
			req.user.id,
			validatedData.data.amount,
			validatedData.data.return_url
		);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Checkout session created successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/payments/personal-wallet/confirm-recharge
 * Confirm wallet recharge after successful Stripe Checkout Session payment
 */
export const confirmWalletRechargeController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = confirmWalletRechargeSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await confirmWalletRecharge(
			req.token,
			req.user.id,
			validatedData.data.session_id
		);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Wallet recharged successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/payments/personal-wallet/balance
 * Get user's personal wallet balance
 */
export const getWalletBalanceController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const result = await getWalletBalance(req.token, req.user.id);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Wallet balance retrieved successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/payments/personal-wallet/session-status/:sessionId
 * Get the status of a Stripe Checkout Session
 */
export const getCheckoutSessionStatusController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const sessionId = req.params.sessionId as string;

		if (!sessionId) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Session ID is required",
			});
			return;
		}

		const result = await getCheckoutSessionStatus(sessionId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Checkout session status retrieved successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/payments/personal-wallet/transactions
 * Get user's wallet transaction history
 */
export const getWalletTransactionsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
		const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

		const result = await getWalletTransactions(req.token, req.user.id, limit, offset);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Wallet transactions retrieved successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// No-Show Handling Controllers
// ============================================

/**
 * POST /api/payments/no-show/process/:slotId
 * FR-2.3.1, FR-2.3.2: Process no-shows for a slot (staff/admin only)
 */
export const processNoShowsController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff or administrators can process no-shows",
			});
			return;
		}

		const paramValidation = slotIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid slot ID",
			});
			return;
		}

		const slotId = parseInt(paramValidation.data.slotId, 10);
		const result = await processNoShows(slotId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		// Also update walk-in inventory
		await updateWalkInInventoryFromNoShows(slotId);

		res.status(result.statusCode).json({
			success: true,
			message: `Processed ${result.data?.length || 0} no-shows`,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Walk-In Controllers
// ============================================

/**
 * GET /api/payments/walk-in/available
 * FR-2.3.4: Get available meals for walk-in users
 */
export const getWalkInMealsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const queryValidation = getWalkInMealsQuerySchema.safeParse(req.query);
		if (!queryValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${queryValidation.error.message}`,
			});
			return;
		}

		const slotId = queryValidation.data.slot_id
			? parseInt(queryValidation.data.slot_id, 10)
			: undefined;
		const result = await getWalkInAvailableMeals(slotId, queryValidation.data.date);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Walk-in meals retrieved successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/payments/walk-in/assign
 * FR-2.3.5: Assign walk-in meal (staff only)
 */
export const assignWalkInMealController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff can assign walk-in meals",
			});
			return;
		}

		const validatedData = assignWalkInMealSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await assignWalkInMeal(req.user.id, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Walk-in meal assigned successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Report Controllers
// ============================================

/**
 * GET /api/payments/reports/no-show
 * FR-2.3.6: Get no-show frequency report
 */
export const getNoShowReportController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff or administrators can view reports",
			});
			return;
		}

		const queryValidation = noShowReportQuerySchema.safeParse(req.query);
		if (!queryValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${queryValidation.error.message}`,
			});
			return;
		}

		const slotId = queryValidation.data.slot_id
			? parseInt(queryValidation.data.slot_id, 10)
			: undefined;

		const result = await getNoShowFrequencyReport(
			queryValidation.data.start_date,
			queryValidation.data.end_date,
			slotId
		);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "No-show report generated successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/payments/reports/unused-slots
 * FR-2.3.7: Get unused slots report
 */
export const getUnusedSlotsReportController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff or administrators can view reports",
			});
			return;
		}

		const queryValidation = unusedSlotsReportQuerySchema.safeParse(req.query);
		if (!queryValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${queryValidation.error.message}`,
			});
			return;
		}

		const result = await getUnusedSlotsReport(queryValidation.data.date);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Unused slots report generated successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/payments/reports/unused-meals
 * FR-2.3.7: Get unused meals report
 */
export const getUnusedMealsReportController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff or administrators can view reports",
			});
			return;
		}

		const queryValidation = unusedMealsReportQuerySchema.safeParse(req.query);
		if (!queryValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${queryValidation.error.message}`,
			});
			return;
		}

		const slotId = queryValidation.data.slot_id
			? parseInt(queryValidation.data.slot_id, 10)
			: undefined;

		const result = await getUnusedMealsReport(queryValidation.data.date, slotId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Unused meals report generated successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Leftover Food Controllers
// ============================================

/**
 * GET /api/payments/leftover/:slotId
 * FR-2.3.16: Detect leftover food
 */
export const getLeftoverFoodController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff or administrators can view leftover data",
			});
			return;
		}

		const paramValidation = slotIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid slot ID",
			});
			return;
		}

		const slotId = parseInt(paramValidation.data.slotId, 10);
		const result = await detectLeftoverFood(slotId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Leftover food detected successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/payments/leftover/transfer
 * FR-2.3.17: Transfer leftover food to next slot
 */
export const transferLeftoverFoodController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		// Check if user is staff or admin
		if (req.user.role !== "staff" && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only staff or administrators can transfer leftover food",
			});
			return;
		}

		const validatedData = transferLeftoverFoodsSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await transferLeftoverToNextSlot(validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Leftover food transferred successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

// ============================================
// Auto-Cancellation Controller
// ============================================

/**
 * POST /api/payments/process-expired
 * FR-2.3.13, FR-2.3.14: Process expired payment windows (scheduled job endpoint)
 */
export const processExpiredPaymentsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// This endpoint should be called by a cron job or admin
		// You may want to add additional security (API key, etc.)
		if (req.user && req.user.role !== "admin") {
			res.status(STATUS.FORBIDDEN).json({
				success: false,
				error: "Only administrators can trigger this operation",
			});
			return;
		}

		const result = await processExpiredPaymentWindows();

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: `Processed ${result.data?.length || 0} expired bookings`,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
