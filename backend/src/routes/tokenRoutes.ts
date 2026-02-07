import { Router } from "express";
import {
	activateTokenController,
	callNextTokenController,
	closeCounterController,
	generateTokenController,
	getQueueStatusController,
	getServiceCountersController,
	getTokenByBookingReferenceController,
	getTokenDetailsController,
	getUserTokensController,
	markTokenServedController,
	reopenCounterController,
} from "../controllers/tokenController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * GET /api/tokens/queue/status?slot_id=&date=YYYY-MM-DD
 * FR-2.2.7: Display the currently served token and queue progress to students
 */
router.get("/queue/status", getQueueStatusController);

/**
 * GET /api/tokens/counters
 * Get all service counters with queue information
 */
router.get("/counters", getServiceCountersController);

// ============================================
// AUTHENTICATED USER ROUTES
// ============================================

/**
 * GET /api/tokens/my-tokens?status=&date=YYYY-MM-DD
 * Get all tokens for the authenticated user
 */
router.get("/my-tokens", requireAuth, getUserTokensController);

/**
 * POST /api/tokens/generate
 * FR-2.2.1: Generate a unique digital token after successful booking confirmation
 * Body: { booking_id: number }
 */
router.post("/generate", requireAuth, generateTokenController);

/**
 * GET /api/tokens/booking/:bookingReference
 * Get token by booking reference
 */
router.get("/booking/:bookingReference", requireAuth, getTokenByBookingReferenceController);

/**
 * GET /api/tokens/:tokenId
 * FR-2.2.3: Display token details to the student, including token number and status
 */
router.get("/:tokenId", requireAuth, getTokenDetailsController);

/**
 * POST /api/tokens/:tokenId/activate
 * FR-2.2.9: Activate token and assign to optimal counter
 */
router.post("/:tokenId/activate", requireAuth, activateTokenController);

// ============================================
// STAFF ROUTES (for serving operations)
// TODO: Add staff middleware for proper authorization
// ============================================

/**
 * POST /api/tokens/counters/:counterId/call-next
 * Call the next token in queue for a specific counter
 */
router.post("/counters/:counterId/call-next", callNextTokenController);

/**
 * POST /api/tokens/:tokenId/mark-served
 * FR-2.2.6: Mark tokens as served after meal collection
 */
router.post("/:tokenId/mark-served", markTokenServedController);

/**
 * POST /api/tokens/counters/:counterId/close
 * FR-2.2.10, FR-2.2.11, FR-2.2.12: Close counter and reassign tokens
 * Body: { reason?: string }
 */
router.post("/counters/:counterId/close", closeCounterController);

/**
 * POST /api/tokens/counters/:counterId/reopen
 * Reopen a closed counter
 */
router.post("/counters/:counterId/reopen", reopenCounterController);

export default router;
