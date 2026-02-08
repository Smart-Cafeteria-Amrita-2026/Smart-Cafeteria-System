import { Router } from "express";
import {
	cancelBookingController,
	createBookingController,
	getAvailableSlotsController,
	getBookingByIdController,
	getBookingPaymentsController,
	getDemandAnalysisController,
	getSlotMenuController,
	getSlotRecommendationsController,
	getUserBookingsController,
	searchMenuController,
	searchUsersController,
	updateBookingController,
} from "../controllers/bookingController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * GET /api/bookings/slots?date=YYYY-MM-DD&meal_type=breakfast|lunch|dinner
 */
router.get("/slots", getAvailableSlotsController);

/**
 * GET /api/bookings/slots/recommendations?date=YYYY-MM-DD&group_size=1
 */
router.get("/slots/recommendations", getSlotRecommendationsController);

/**
 * GET /api/bookings/slots/:slotId/menu?search_text=&category=&is_vegetarian=
 */
router.get("/slots/:slotId/menu", getSlotMenuController);

/**
 * GET /api/bookings/demand-analysis?date=YYYY-MM-DD
 */
router.get("/demand-analysis", getDemandAnalysisController);

/**
 * POST /api/bookings/menu/search
 * Body: { slot_id, search_text?, category?, is_vegetarian? }
 */
router.post("/menu/search", searchMenuController);

/**
 * GET /api/bookings/users/search?email=<query>
 * Fast search for users by email prefix (for group booking member selection)
 */
router.get("/users/search", requireAuth, searchUsersController);

/**
 * Get user's bookings
 * GET /api/bookings/my-bookings?status=pending_payment|confirmed|cancelled|completed
 */
router.get("/my-bookings", requireAuth, getUserBookingsController);

/**
 * Get booking payments for the authenticated user
 * GET /api/bookings/payments
 */
router.get("/payments", requireAuth, getBookingPaymentsController);

/**
 * POST /api/bookings
 * Body: { slot_id, group_size, menu_items: [{ menu_item_id, quantity }], group_member_ids? }
 */
router.post("/", requireAuth, createBookingController);

/**
 * Get booking by ID
 * GET /api/bookings/:bookingId
 */
router.get("/:bookingId", requireAuth, getBookingByIdController);

/**
 
 * PUT /api/bookings/:bookingId
 * Body: { menu_items?, group_size?, group_member_ids? }
 */
router.put("/:bookingId", requireAuth, updateBookingController);

/**
 
 * DELETE /api/bookings/:bookingId
 * Body: { cancellation_reason? }
 */
router.delete("/:bookingId", requireAuth, cancelBookingController);

export default router;
