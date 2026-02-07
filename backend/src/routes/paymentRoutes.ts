import { Router } from "express";
import express from "express";
import {
	assignWalkInMealController,
	confirmPaymentController,
	confirmWalletRechargeController,
	contributeToWalletController,
	createPaymentIntentController,
	createWalletRechargeSessionController,
	extendPaymentWindowController,
	getCheckoutSessionStatusController,
	getLeftoverFoodController,
	getNoShowReportController,
	getPaymentWindowController,
	getUnusedMealsReportController,
	getUnusedSlotsReportController,
	getWalkInMealsController,
	getWalletBalanceController,
	getWalletContributionsController,
	getWalletTransactionsController,
	processExpiredPaymentsController,
	processNoShowsController,
	settleBillController,
	stripeWebhookController,
	transferLeftoverFoodController,
} from "../controllers/paymentController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// ============================================
// STRIPE WEBHOOK (Must be before express.json() middleware)
// This needs raw body for signature verification
// ============================================

/**
 * POST /api/payments/stripe/webhook
 * Stripe webhook endpoint - requires raw body
 */
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhookController);

// ============================================
// PAYMENT WINDOW ROUTES
// ============================================

/**
 * GET /api/payments/window/:bookingId
 * FR-2.3.8: Get payment window status for a booking
 */
router.get("/window/:bookingId", requireAuth, getPaymentWindowController);

/**
 * POST /api/payments/window/:bookingId/extend
 * FR-2.3.15: Extend payment window (admin only)
 * Body: { extension_minutes: number }
 */
router.post("/window/:bookingId/extend", requireAuth, extendPaymentWindowController);

// ============================================
// BOOKING WALLET ROUTES (Bill Sharing)
// ============================================

/**
 * POST /api/payments/wallet/contribute
 * FR-2.3.10, FR-2.3.11: Contribute to booking wallet for bill sharing
 * Body: { booking_id: number, amount: number, payment_method_id?: string }
 */
router.post("/wallet/contribute", requireAuth, contributeToWalletController);

/**
 * GET /api/payments/wallet/:bookingId/contributions
 * Get all contributions to a booking wallet
 */
router.get("/wallet/:bookingId/contributions", requireAuth, getWalletContributionsController);

// ============================================
// BILL SETTLEMENT ROUTES
// ============================================

/**
 * POST /api/payments/settle/:bookingId
 * FR-2.3.12: Settle bill using accumulated wallet balance
 */
router.post("/settle/:bookingId", requireAuth, settleBillController);

// ============================================
// STRIPE PAYMENT ROUTES
// ============================================

/**
 * POST /api/payments/stripe/create-intent
 * Create a Stripe payment intent for booking payment
 * Body: { booking_id: number, amount: number }
 */
router.post("/stripe/create-intent", requireAuth, createPaymentIntentController);

/**
 * POST /api/payments/stripe/confirm
 * Confirm a Stripe payment after client-side completion
 * Body: { booking_id: number, payment_intent_id: string }
 */
router.post("/stripe/confirm", requireAuth, confirmPaymentController);

// ============================================
// PERSONAL WALLET ROUTES (Stripe Embedded Checkout)
// ============================================

/**
 * POST /api/payments/personal-wallet/create-session
 * Create a Stripe Checkout Session for recharging personal wallet (embedded UI mode)
 * Body: { amount: number, return_url: string }
 */
router.post("/personal-wallet/create-session", requireAuth, createWalletRechargeSessionController);

/**
 * GET /api/payments/personal-wallet/balance
 * Get user's personal wallet balance
 */
router.get("/personal-wallet/balance", requireAuth, getWalletBalanceController);

/**
 * GET /api/payments/personal-wallet/session-status/:sessionId
 * Get the status of a Stripe Checkout Session
 */
router.get(
	"/personal-wallet/session-status/:sessionId",
	requireAuth,
	getCheckoutSessionStatusController
);

/**
 * POST /api/payments/personal-wallet/confirm-recharge
 * Confirm wallet recharge after successful Stripe Checkout Session payment
 * Body: { session_id: string }
 */
router.post("/personal-wallet/confirm-recharge", requireAuth, confirmWalletRechargeController);

/**
 * GET /api/payments/personal-wallet/transactions?limit=20&offset=0
 * Get user's wallet transaction history
 */
router.get("/personal-wallet/transactions", requireAuth, getWalletTransactionsController);

// ============================================
// NO-SHOW HANDLING ROUTES
// ============================================

/**
 * POST /api/payments/no-show/process/:slotId
 * FR-2.3.1, FR-2.3.2: Process no-shows for a slot (staff/admin only)
 * This marks tokens as no-show and removes them from active queue
 */
router.post("/no-show/process/:slotId", requireAuth, processNoShowsController);

// ============================================
// WALK-IN ROUTES
// ============================================

/**
 * GET /api/payments/walk-in/available?slot_id=&date=YYYY-MM-DD
 * FR-2.3.3, FR-2.3.4: Get available meals for walk-in users
 * Display unused meal portions on staff dashboard
 */
router.get("/walk-in/available", getWalkInMealsController);

/**
 * POST /api/payments/walk-in/assign
 * FR-2.3.5: Assign unused meals to walk-in users (staff only)
 * Body: { slot_id: number, menu_item_id: number, quantity: number }
 */
router.post("/walk-in/assign", requireAuth, assignWalkInMealController);

// ============================================
// REPORTING ROUTES
// ============================================

/**
 * GET /api/payments/reports/no-show?start_date=&end_date=&slot_id=
 * FR-2.3.6: Get no-show frequency report
 */
router.get("/reports/no-show", requireAuth, getNoShowReportController);

/**
 * GET /api/payments/reports/unused-slots?date=YYYY-MM-DD
 * FR-2.3.7: Get unused slots report
 */
router.get("/reports/unused-slots", requireAuth, getUnusedSlotsReportController);

/**
 * GET /api/payments/reports/unused-meals?date=YYYY-MM-DD&slot_id=
 * FR-2.3.7: Get unused meals report
 */
router.get("/reports/unused-meals", requireAuth, getUnusedMealsReportController);

// ============================================
// LEFTOVER FOOD ROUTES
// ============================================

/**
 * GET /api/payments/leftover/:slotId
 * FR-2.3.16: Detect leftover food portions in a slot
 */
router.get("/leftover/:slotId", requireAuth, getLeftoverFoodController);

/**
 * POST /api/payments/leftover/transfer
 * FR-2.3.17: Transfer leftover food to next slot
 * Body: { from_slot_id: number, to_slot_id: number, items: [{ menu_item_id, quantity }] }
 */
router.post("/leftover/transfer", requireAuth, transferLeftoverFoodController);

// ============================================
// AUTO-CANCELLATION ROUTES
// ============================================

/**
 * POST /api/payments/process-expired
 * FR-2.3.13, FR-2.3.14: Process expired payment windows
 * This should be called by a scheduled job (cron)
 * Automatically cancels bookings with expired payment windows
 * and releases slot capacity and food resources
 */
router.post("/process-expired", processExpiredPaymentsController);

export default router;
