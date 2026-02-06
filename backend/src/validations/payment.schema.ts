import { z } from "zod";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "../interfaces/payment.types";

// ============================================
// Payment Window Schemas
// ============================================

// Get payment window status
export const getPaymentWindowSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
});

// Extend payment window (admin only)
export const extendPaymentWindowSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
	extension_minutes: z
		.number()
		.int()
		.min(5, "Extension must be at least 5 minutes")
		.max(60, "Extension cannot exceed 60 minutes"),
});

// ============================================
// Wallet Contribution Schemas
// ============================================

// Contribute to booking wallet
export const walletContributionSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
	amount: z.number().positive("Amount must be positive"),
	payment_method_id: z.string().optional(), // Stripe payment method ID
});

// ============================================
// Stripe Payment Schemas
// ============================================

// Create payment intent
export const createPaymentIntentSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
	amount: z.number().positive("Amount must be positive"),
});

// Confirm payment
export const confirmPaymentSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
	payment_intent_id: z.string().min(1, "Payment intent ID is required"),
});

// ============================================
// Bill Settlement Schemas
// ============================================

// Settle bill using wallet balance
export const settleBillSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
});

// ============================================
// Walk-In Meal Schemas
// ============================================

// Get available walk-in meals
export const getWalkInMealsQuerySchema = z.object({
	slot_id: z.string().regex(/^\d+$/, "Slot ID must be a number").optional(),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
		.optional(),
});

// Walk-in menu item schema
const walkInMenuItemSchema = z.object({
	menu_item_id: z.number().int().positive("Menu item ID must be a positive integer"),
	quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Assign walk-in meal (create booking for walk-in user)
export const assignWalkInMealSchema = z
	.object({
		slot_id: z.number().int().positive("Slot ID must be a positive integer"),
		user_mobile_number: z
			.string()
			.min(10, "Mobile number must be at least 10 digits")
			.max(15, "Mobile number must not exceed 15 digits")
			.regex(/^[0-9+\-\s]+$/, "Invalid mobile number format"),
		menu_items: z.array(walkInMenuItemSchema).min(1, "At least one menu item is required"),
		booking_type: z.enum(["dine-in", "take-away"], {
			error: "Booking type must be 'dine-in' or 'take-away'",
		}),
		payment_method: z
			.enum(["cash", "ebooking"], {
				error: "Payment method must be 'cash' or 'ebooking'",
			})
			.optional(),
		amount: z.number().positive("Amount must be positive").optional(),
		member_count: z.number(),
	})
	.refine(
		(data) => {
			// If payment_method is "cash", amount is required
			if (data.payment_method === "cash" && (data.amount === undefined || data.amount <= 0)) {
				return false;
			}
			return true;
		},
		{
			message: "Amount is required when payment method is 'cash'",
			path: ["amount"],
		}
	);

// ============================================
// No-Show Report Schemas
// ============================================

// Get no-show frequency report
export const noShowReportQuerySchema = z.object({
	start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
	end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
	slot_id: z.string().regex(/^\d+$/, "Slot ID must be a number").optional(),
});

// ============================================
// Unused Resources Report Schemas
// ============================================

// Get unused slots report
export const unusedSlotsReportQuerySchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

// Get unused meals report
export const unusedMealsReportQuerySchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	slot_id: z.string().regex(/^\d+$/, "Slot ID must be a number").optional(),
});

// ============================================
// Leftover Transfer Schemas
// ============================================

// Get leftover foods
export const getLeftoverFoodsQuerySchema = z.object({
	slot_id: z.string().regex(/^\d+$/, "Slot ID must be a number"),
});

// Transfer leftover foods
export const transferLeftoverFoodsSchema = z.object({
	from_slot_id: z.number().int().positive("From slot ID must be a positive integer"),
	to_slot_id: z.number().int().positive("To slot ID must be a positive integer"),
	items: z
		.array(
			z.object({
				menu_item_id: z.number().int().positive("Menu item ID must be a positive integer"),
				quantity: z.number().int().min(1, "Quantity must be at least 1"),
			})
		)
		.min(1, "At least one item must be transferred"),
});

// ============================================
// Param Schemas
// ============================================

export const bookingIdParamSchema = z.object({
	bookingId: z.string().regex(/^\d+$/, "Booking ID must be a number"),
});

export const slotIdParamSchema = z.object({
	slotId: z.string().regex(/^\d+$/, "Slot ID must be a number"),
});

// ============================================
// Stripe Webhook Schema
// ============================================

export const stripeWebhookHeaderSchema = z.object({
	"stripe-signature": z.string(),
});

// ============================================
// Type Exports
// ============================================

export type GetPaymentWindowInput = z.infer<typeof getPaymentWindowSchema>;
export type ExtendPaymentWindowInput = z.infer<typeof extendPaymentWindowSchema>;
export type WalletContributionInput = z.infer<typeof walletContributionSchema>;
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type SettleBillInput = z.infer<typeof settleBillSchema>;
export type GetWalkInMealsQueryInput = z.infer<typeof getWalkInMealsQuerySchema>;
export type AssignWalkInMealInput = z.infer<typeof assignWalkInMealSchema>;
export type NoShowReportQueryInput = z.infer<typeof noShowReportQuerySchema>;
export type UnusedSlotsReportQueryInput = z.infer<typeof unusedSlotsReportQuerySchema>;
export type UnusedMealsReportQueryInput = z.infer<typeof unusedMealsReportQuerySchema>;
export type GetLeftoverFoodsQueryInput = z.infer<typeof getLeftoverFoodsQuerySchema>;
export type TransferLeftoverFoodsInput = z.infer<typeof transferLeftoverFoodsSchema>;

// ============================================
// Personal Wallet Recharge Schemas (Stripe Embedded Checkout)
// ============================================

// Create wallet recharge checkout session
export const createWalletRechargeIntentSchema = z.object({
	amount: z
		.number()
		.positive("Amount must be positive")
		.min(1, "Minimum recharge amount is ₹1")
		.max(10000, "Maximum recharge amount is ₹10,000"),
	return_url: z.string().url("Return URL must be a valid URL"),
});

// Confirm wallet recharge (after checkout completion)
export const confirmWalletRechargeSchema = z.object({
	session_id: z.string().min(1, "Checkout session ID is required"),
});

// Get checkout session status
export const getCheckoutSessionStatusSchema = z.object({
	session_id: z.string().min(1, "Checkout session ID is required"),
});

export type CreateWalletRechargeIntentInput = z.infer<typeof createWalletRechargeIntentSchema>;
export type ConfirmWalletRechargeInput = z.infer<typeof confirmWalletRechargeSchema>;
export type GetCheckoutSessionStatusInput = z.infer<typeof getCheckoutSessionStatusSchema>;
