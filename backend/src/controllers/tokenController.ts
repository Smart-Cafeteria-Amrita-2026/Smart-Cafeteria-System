import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	activateToken,
	closeCounterAndReassign,
	generateToken,
	getQueueProgress,
	getServiceCounters,
	getTokenByBookingReference,
	getTokenDetails,
	getUserTokens,
	markTokenAsServed,
	reopenCounter,
	startServingToken,
} from "../services/tokenService";
import {
	closeCounterSchema,
	counterIdParamSchema,
	generateTokenSchema,
	getQueueStatusSchema,
	getUserTokensQuerySchema,
	tokenIdParamSchema,
	updateCounterStatusSchema,
} from "../validations/token.schema";

// ============================================
// Token Generation Controllers
// ============================================

/**
 * POST /api/tokens/generate
 * FR-2.2.1: Generate a unique digital token after successful booking confirmation
 */
export const generateTokenController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = generateTokenSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await generateToken(req.token, req.user.id, validatedData.data.booking_id);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Token generated successfully",
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
 * GET /api/tokens/:tokenId
 * FR-2.2.3: Display token details to the student, including token number and status
 */
export const getTokenDetailsController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const paramValidation = tokenIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid token ID",
			});
			return;
		}

		const tokenId = parseInt(paramValidation.data.tokenId, 10);

		const result = await getTokenDetails(req.token, req.user.id, tokenId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Token details retrieved successfully",
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
 * GET /api/tokens/my-tokens
 * Get all tokens for the authenticated user
 */
export const getUserTokensController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const queryValidation = getUserTokensQuerySchema.safeParse(req.query);
		if (!queryValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${queryValidation.error.message}`,
			});
			return;
		}

		const { status, date } = queryValidation.data;

		const result = await getUserTokens(req.token, req.user.id, status, date);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "User tokens retrieved successfully",
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
 * GET /api/tokens/booking/:bookingReference
 * Get token by booking reference
 */
export const getTokenByBookingReferenceController = async (
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

		const bookingReference = req.params.bookingReference as string;

		if (!bookingReference) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Booking reference is required",
			});
			return;
		}

		const result = await getTokenByBookingReference(req.token, req.user.id, bookingReference);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Token retrieved successfully",
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
// Token Activation Controllers
// ============================================

/**
 * POST /api/tokens/:tokenId/activate
 * FR-2.2.9: Assign tokens to available counters to optimize serving speed
 */
export const activateTokenController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const paramValidation = tokenIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid token ID",
			});
			return;
		}

		const tokenId = parseInt(paramValidation.data.tokenId, 10);

		const result = await activateToken(req.token, req.user.id, tokenId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Token activated successfully",
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
// Queue Display Controllers
// ============================================

/**
 * GET /api/tokens/queue/status
 * FR-2.2.7: Display the currently served token and queue progress to students
 */
export const getQueueStatusController = async (req: Request, res: Response): Promise<void> => {
	try {
		const queryValidation = getQueueStatusSchema.safeParse(req.query);
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
		const date = queryValidation.data.date;

		const result = await getQueueProgress(slotId, date);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Queue status retrieved successfully",
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
// Token Serving Controllers (Staff)
// ============================================

/**
 * POST /api/tokens/counters/:counterId/call-next
 * Call the next token in queue for a counter (Staff)
 */
export const callNextTokenController = async (req: Request, res: Response): Promise<void> => {
	try {
		const paramValidation = counterIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid counter ID",
			});
			return;
		}

		const counterId = parseInt(paramValidation.data.counterId, 10);

		const result = await startServingToken(counterId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		if (!result.data) {
			res.status(STATUS.SUCCESS).json({
				success: true,
				message: "No tokens in queue for this counter",
				data: null,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Now serving token",
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
 * POST /api/tokens/:tokenId/mark-served
 * FR-2.2.6: Mark tokens as served after meal collection (Staff)
 */
export const markTokenServedController = async (req: Request, res: Response): Promise<void> => {
	try {
		const paramValidation = tokenIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid token ID",
			});
			return;
		}

		const tokenId = parseInt(paramValidation.data.tokenId, 10);

		const result = await markTokenAsServed(tokenId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Token marked as served",
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
// Counter Management Controllers
// ============================================

/**
 * GET /api/tokens/counters
 * Get all service counters with queue information
 */
export const getServiceCountersController = async (_req: Request, res: Response): Promise<void> => {
	try {
		const result = await getServiceCounters();

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Service counters retrieved successfully",
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
 * POST /api/tokens/counters/:counterId/close
 * FR-2.2.10, FR-2.2.11, FR-2.2.12: Close a counter and reassign tokens
 */
export const closeCounterController = async (req: Request, res: Response): Promise<void> => {
	try {
		const paramValidation = counterIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid counter ID",
			});
			return;
		}

		const counterId = parseInt(paramValidation.data.counterId, 10);
		// const reason = req.body.reason as string | undefined;

		const result = await closeCounterAndReassign(counterId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Counter closed and tokens reassigned",
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
 * POST /api/tokens/counters/:counterId/reopen
 * Reopen a closed counter
 */
export const reopenCounterController = async (req: Request, res: Response): Promise<void> => {
	try {
		const paramValidation = counterIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid counter ID",
			});
			return;
		}

		const counterId = parseInt(paramValidation.data.counterId, 10);

		const result = await reopenCounter(counterId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Counter reopened successfully",
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
