import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	analyzeDemand,
	cancelBooking,
	createBooking,
	getAvailableSlots,
	getBookingById,
	getBookingPaymentsByUserId,
	getSlotMenuItems,
	getSlotRecommendations,
	getUserBookings,
	searchUsersByEmail,
	updateBooking,
} from "../services/bookingService";
import {
	addGroupMemberSchema,
	bookingIdParamSchema,
	cancelBookingSchema,
	createBookingSchema,
	getAvailableSlotsSchema,
	menuSearchSchema,
	searchUsersSchema,
	slotIdParamSchema,
	slotRecommendationSchema,
	updateBookingSchema,
} from "../validations/booking.schema";

/**
 * GET /api/bookings/payments
 */
export const getBookingPaymentsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const result = await getBookingPaymentsByUserId(userId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Booking payments retrieved successfully",
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
 * GET /api/bookings/slots
 */
export const getAvailableSlotsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedQuery = getAvailableSlotsSchema.safeParse(req.query);

		if (!validatedQuery.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedQuery.error.message}`,
			});
			return;
		}

		const { date, meal_type } = validatedQuery.data;
		const result = await getAvailableSlots(date, meal_type);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Available slots retrieved successfully",
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
 * GET /api/bookings/slots/:slotId/menu
 */
export const getSlotMenuController = async (req: Request, res: Response): Promise<void> => {
	try {
		const paramValidation = slotIdParamSchema.safeParse(req.params);
		if (!paramValidation.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid slot ID",
			});
			return;
		}

		const slotId = parseInt(paramValidation.data.slotId, 10);

		// Parse query params for filtering
		const searchText = req.query.search_text as string | undefined;
		const category = req.query.category as string | undefined;
		const isVegetarian =
			req.query.is_vegetarian === "true"
				? true
				: req.query.is_vegetarian === "false"
					? false
					: undefined;

		const result = await getSlotMenuItems(slotId, searchText, category, isVegetarian);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Menu items retrieved successfully",
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
 * POST /api/bookings/menu/search
 */
export const searchMenuController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedData = menuSearchSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const { slot_id, search_text, category, is_vegetarian } = validatedData.data;
		const result = await getSlotMenuItems(slot_id, search_text, category, is_vegetarian);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Menu search completed successfully",
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
 * POST /api/bookings
 */
export const createBookingController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedData = createBookingSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await createBooking(req.token, req.user.id, validatedData.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Booking created successfully",
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
 * PUT /api/bookings/:bookingId
 */
export const updateBookingController = async (req: Request, res: Response): Promise<void> => {
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

		const validatedData = updateBookingSchema.safeParse(req.body);

		if (!validatedData.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedData.error.message}`,
			});
			return;
		}

		const result = await updateBooking(req.user.id, bookingId, validatedData.data, req.token);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Booking updated successfully",
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
 * DELETE /api/bookings/:bookingId
 */
export const cancelBookingController = async (req: Request, res: Response): Promise<void> => {
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
		const reason = req.body.cancellation_reason as string | undefined;

		const result = await cancelBooking(req.token, req.user.id, bookingId, reason);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Booking cancelled successfully",
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
 * Get user's bookings
 * GET /api/bookings/my-bookings
 */
export const getUserBookingsController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user || !req.token) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}
		console.log(req.user.id);
		const status = req.query.status as string | undefined;

		const result = await getUserBookings(req.token, req.user.id, status);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Bookings retrieved successfully",
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
 * Get booking by ID
 * GET /api/bookings/:bookingId
 */
export const getBookingByIdController = async (req: Request, res: Response): Promise<void> => {
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

		const result = await getBookingById(req.token, req.user.id, bookingId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Booking retrieved successfully",
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
 * GET /api/bookings/slots/recommendations
 */
export const getSlotRecommendationsController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const validatedQuery = slotRecommendationSchema.safeParse(req.query);

		if (!validatedQuery.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedQuery.error.message}`,
			});
			return;
		}

		const { date, group_size } = validatedQuery.data;
		const result = await getSlotRecommendations(date, group_size);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Slot recommendations retrieved successfully",
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
 * GET /api/bookings/demand-analysis
 */
export const getDemandAnalysisController = async (req: Request, res: Response): Promise<void> => {
	try {
		const date = req.query.date as string;

		if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Valid date (YYYY-MM-DD) is required",
			});
			return;
		}

		const result = await analyzeDemand(date);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Demand analysis retrieved successfully",
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
 * GET /api/bookings/users/search?email=<query>
 * Fast search endpoint for finding users by email prefix (for group booking)
 */
export const searchUsersController = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.user) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const validatedQuery = searchUsersSchema.safeParse(req.query);

		if (!validatedQuery.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedQuery.error.message}`,
			});
			return;
		}

		const result = await searchUsersByEmail(validatedQuery.data.email, req.user.id);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
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
