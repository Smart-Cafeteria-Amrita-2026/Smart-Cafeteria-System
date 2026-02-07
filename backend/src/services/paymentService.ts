import Stripe from "stripe";
import { service_client, getAuthenticatedClient } from "../config/supabase";
import type {
	AssignWalkInMealRequest,
	AssignWalkInMealResponse,
	AutoCancellationResult,
	BillSettlementRequest,
	BillSettlementResponse,
	ConfirmPaymentRequest,
	CreatePaymentIntentRequest,
	LeftoverFood,
	LeftoverTransferRequest,
	LeftoverTransferResponse,
	NoShowFrequencyReport,
	NoShowStats,
	NoShowToken,
	PaymentConfirmationResponse,
	PaymentIntentResponse,
	PaymentWindow,
	PaymentWindowExtension,
	UnusedMealsReport,
	UnusedSlotsReport,
	WalkInMealItem,
	WalletContributionRequest,
	WalletContributionResponse,
} from "../interfaces/payment.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import { generateBookingReference } from "./bookingService";
import {
	getCurrentISOStringIST,
	getCurrentDateStringIST,
	getCurrentTimeStringIST,
	createISTDate,
	createISTISOString,
	getNowInIST,
	isWithinTimeWindow,
	getTimeDifferenceMs,
	formatToISTISOString,
	convertUTCToIST,
} from "../utils/dateUtils";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2026-01-28.clover",
});

// ============================================
// Helper Functions
// ============================================

/**
 * Check if payment window is active for a booking (IST)
 */
const isPaymentWindowActive = (booking: any): boolean => {
	const now = new Date();
	const slotDate = booking.meal_slots.slot_date;
	const paymentWindowStart = booking.meal_slots.payment_window_start;
	const paymentWindowEnd = booking.meal_slots.payment_window_end;

	const windowStart = createISTDate(slotDate, paymentWindowStart);
	const windowEnd = createISTDate(slotDate, paymentWindowEnd);

	// Also check booking-specific deadline if it was extended
	const bookingDeadline = new Date(booking.payment_deadline);
	const effectiveEnd = bookingDeadline > windowEnd ? bookingDeadline : windowEnd;

	return now >= windowStart && now <= effectiveEnd;
};

/**
 * Calculate time remaining in payment window (IST)
 */
const getTimeRemaining = (booking: any): number => {
	const now = new Date();
	const bookingDeadline = new Date(booking.payment_deadline);
	const diffMs = getTimeDifferenceMs(bookingDeadline, now);
	return Math.max(0, Math.floor(diffMs / 60000)); // Convert to minutes
};

/**
 * Release slot capacity and food resources for a cancelled booking
 */
const releaseBookingResources = async (
	bookingId: number
): Promise<{
	capacityReleased: number;
	foodResourcesReleased: { menu_item_id: number; quantity: number }[];
}> => {
	// Get booking details
	const { data: booking, error: bookingError } = await service_client
		.from("bookings")
		.select(`
			*,
			meal_slots (*),
			booking_menu_items (*)
		`)
		.eq("booking_id", bookingId)
		.single();

	if (bookingError || !booking) {
		throw new Error("Booking not found");
	}

	const foodResourcesReleased: { menu_item_id: number; quantity: number }[] = [];

	// Release slot capacity
	const { error: slotError } = await service_client
		.from("meal_slots")
		.update({
			current_occupancy: Math.max(0, booking.meal_slots.current_occupancy - booking.group_size),
			is_active: true, // Reactivate if was full
		})
		.eq("slot_id", booking.slot_id);

	if (slotError) {
		console.error("Error releasing slot capacity:", slotError);
	}

	// Release food resources (reserved quantities)
	for (const item of booking.booking_menu_items) {
		const { data: mapping, error: mappingError } = await service_client
			.from("slot_menu_mapping")
			.select("*")
			.eq("slot_id", booking.slot_id)
			.eq("menu_item_id", item.menu_item_id)
			.single();

		if (mapping && !mappingError) {
			const newReservedQty = Math.max(0, mapping.reserved_quantity - item.quantity);
			const newLeftoverQty = mapping.available_quantity - newReservedQty;

			await service_client
				.from("slot_menu_mapping")
				.update({
					reserved_quantity: newReservedQty,
					leftover_quantity: newLeftoverQty,
					is_available: newLeftoverQty > 0,
				})
				.eq("mapping_id", mapping.mapping_id);

			foodResourcesReleased.push({
				menu_item_id: item.menu_item_id,
				quantity: item.quantity,
			});
		}
	}

	return {
		capacityReleased: booking.group_size,
		foodResourcesReleased,
	};
};

// ============================================
// FR-2.3.8, FR-2.3.9: Payment Window Services
// ============================================

/**
 * FR-2.3.8: Get payment window status for a booking
 * Payment window opens 20 minutes before slot start time
 */
export const getPaymentWindowStatus = async (
	token: string,
	userId: string,
	bookingId: number
): Promise<ServiceResponse<PaymentWindow>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get booking with slot details
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_group_members (user_id)
			`)
			.eq("booking_id", bookingId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user is authorized
		const isAuthorized =
			booking.primary_user_id === userId ||
			booking.booking_group_members.some((m: { user_id: string }) => m.user_id === userId);

		if (!isAuthorized) {
			return {
				success: false,
				error: "You are not authorized to view this booking's payment window",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		const slotDate = booking.meal_slots.slot_date;
		const windowStart = createISTISOString(slotDate, booking.meal_slots.payment_window_start);
		const windowEnd = booking.payment_deadline;

		const isActive = isPaymentWindowActive(booking);
		const timeRemaining = getTimeRemaining(booking);
		const amountDue = Number(booking.total_amount) - Number(booking.wallet_balance);

		return {
			success: true,
			data: {
				booking_id: booking.booking_id,
				booking_reference: booking.booking_reference,
				window_start: windowStart,
				window_end: windowEnd,
				is_active: isActive,
				time_remaining_minutes: timeRemaining,
				total_amount: Number(booking.total_amount),
				wallet_balance: Number(booking.wallet_balance),
				amount_due: Math.max(0, amountDue),
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.3.15: Allow administrators to extend the payment window
 */
export const extendPaymentWindow = async (
	adminId: string,
	bookingId: number,
	extensionMinutes: number
): Promise<ServiceResponse<PaymentWindowExtension>> => {
	try {
		// Get booking
		const { data: booking, error: bookingError } = await service_client
			.from("bookings")
			.select(`*, meal_slots (*)`)
			.eq("booking_id", bookingId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if booking is still in pending_payment status
		if (booking.booking_status !== "pending_payment") {
			return {
				success: false,
				error: "Can only extend payment window for pending bookings",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Calculate new deadline (IST)
		const currentDeadline = new Date(booking.payment_deadline);
		const newDeadline = new Date(currentDeadline.getTime() + extensionMinutes * 60000);
		const newDeadlineIST = formatToISTISOString(convertUTCToIST(newDeadline));

		// Update booking deadline
		const { error: updateError } = await service_client
			.from("bookings")
			.update({ payment_deadline: newDeadlineIST })
			.eq("booking_id", bookingId);

		if (updateError) {
			return {
				success: false,
				error: "Failed to extend payment window",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Log admin action
		await service_client.from("admin_audit_log").insert({
			admin_id: adminId,
			action_type: "EXTEND_PAYMENT_WINDOW",
			target_entity: "bookings",
			target_id: bookingId.toString(),
			old_value: { payment_deadline: booking.payment_deadline },
			new_value: { payment_deadline: newDeadlineIST },
			description: `Extended payment window by ${extensionMinutes} minutes`,
		});

		return {
			success: true,
			data: {
				booking_id: bookingId,
				new_deadline: newDeadlineIST,
				extended_by_minutes: extensionMinutes,
				extended_by_admin_id: adminId,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// FR-2.3.10, FR-2.3.11: Booking Wallet Services
// ============================================

/**
 * FR-2.3.10, FR-2.3.11: Contribute to booking wallet for bill sharing
 */
export const contributeToBookingWallet = async (
	token: string,
	userId: string,
	contributionData: WalletContributionRequest
): Promise<ServiceResponse<WalletContributionResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);
		const { booking_id, amount } = contributionData;

		// Get booking with group members
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_group_members (user_id)
			`)
			.eq("booking_id", booking_id)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user is part of the group
		const isMember =
			booking.primary_user_id === userId ||
			booking.booking_group_members.some((m: { user_id: string }) => m.user_id === userId);

		if (!isMember) {
			return {
				success: false,
				error: "Only group members can contribute to the booking wallet",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// FR-2.3.9: Check if payment window is active
		if (!isPaymentWindowActive(booking)) {
			return {
				success: false,
				error:
					"Payment window is not active. Contributions can only be made within the payment window.",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Check booking status
		if (booking.booking_status !== "pending_payment") {
			return {
				success: false,
				error: "Booking is not in pending payment status",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Get user's wallet balance
		const { data: user, error: userError } = await service_client
			.from("users")
			.select("wallet_balance")
			.eq("id", userId)
			.single();

		if (userError || !user) {
			return {
				success: false,
				error: "User not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		if (Number(user.wallet_balance) < amount) {
			return {
				success: false,
				error: `Insufficient wallet balance. Available: ${user.wallet_balance}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Calculate remaining amount needed
		const remainingToPay = Number(booking.total_amount) - Number(booking.wallet_balance);
		const actualContribution = Math.min(amount, remainingToPay);

		if (actualContribution <= 0) {
			return {
				success: false,
				error: "Booking is already fully paid",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Deduct from user's wallet
		const { error: deductError } = await service_client
			.from("users")
			.update({
				wallet_balance: Number(user.wallet_balance) - actualContribution,
			})
			.eq("id", userId);

		if (deductError) {
			return {
				success: false,
				error: "Failed to deduct from wallet",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Record the payment contribution
		const { data: payment, error: paymentError } = await service_client
			.from("booking_payments")
			.insert({
				booking_id: booking_id,
				user_id: userId,
				amount: actualContribution,
			})
			.select()
			.single();

		if (paymentError) {
			// Rollback user wallet deduction
			await service_client
				.from("users")
				.update({ wallet_balance: Number(user.wallet_balance) })
				.eq("id", userId);

			return {
				success: false,
				error: "Failed to record payment contribution",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Update booking wallet balance
		const newWalletBalance = Number(booking.wallet_balance) + actualContribution;
		const isFullyPaid = newWalletBalance >= Number(booking.total_amount);

		const updateData: any = {
			wallet_balance: newWalletBalance,
		};

		// If fully paid, update booking status
		if (isFullyPaid) {
			updateData.booking_status = "confirmed";
		}

		const { error: updateError } = await service_client
			.from("bookings")
			.update(updateData)
			.eq("booking_id", booking_id);

		if (updateError) {
			return {
				success: false,
				error: "Failed to update booking wallet balance",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: {
				contribution_id: payment.id,
				booking_id: booking_id,
				amount_contributed: actualContribution,
				booking_wallet_balance: newWalletBalance,
				total_amount: Number(booking.total_amount),
				remaining_to_pay: Math.max(0, Number(booking.total_amount) - newWalletBalance),
				is_fully_paid: isFullyPaid,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get all contributions to a booking wallet
 */
export const getBookingWalletContributions = async (
	token: string,
	userId: string,
	bookingId: number
): Promise<ServiceResponse<{ contributions: any[]; total_contributed: number }>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get booking to verify access
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				booking_group_members (user_id)
			`)
			.eq("booking_id", bookingId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check authorization
		const isAuthorized =
			booking.primary_user_id === userId ||
			booking.booking_group_members.some((m: { user_id: string }) => m.user_id === userId);

		if (!isAuthorized) {
			return {
				success: false,
				error: "Not authorized to view this booking's contributions",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Get all contributions
		const { data: contributions, error: contributionsError } = await service_client
			.from("booking_payments")
			.select(`
				*,
				users (first_name, last_name, college_id)
			`)
			.eq("booking_id", bookingId)
			.order("created_at", { ascending: true });

		if (contributionsError) {
			return {
				success: false,
				error: "Failed to fetch contributions",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const totalContributed = (contributions || []).reduce((sum, c) => sum + Number(c.amount), 0);

		return {
			success: true,
			data: {
				contributions: contributions || [],
				total_contributed: totalContributed,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// FR-2.3.12: Bill Settlement Services
// ============================================

/**
 * FR-2.3.12: Settle the final bill using accumulated wallet balance
 */
export const settleBill = async (
	token: string,
	userId: string,
	bookingId: number
): Promise<ServiceResponse<BillSettlementResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get booking
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_group_members (user_id)
			`)
			.eq("booking_id", bookingId)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check authorization (only primary user can settle)
		if (booking.primary_user_id !== userId) {
			return {
				success: false,
				error: "Only the primary booking holder can settle the bill",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Check booking status
		if (booking.booking_status !== "pending_payment") {
			return {
				success: false,
				error: `Cannot settle bill for a ${booking.booking_status} booking`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// FR-2.3.9: Check if payment window is active
		if (!isPaymentWindowActive(booking)) {
			return {
				success: false,
				error: "Payment window has expired",
				statusCode: STATUS.BADREQUEST,
			};
		}

		const totalAmount = Number(booking.total_amount);
		const walletBalance = Number(booking.wallet_balance);
		const remainingAmount = totalAmount - walletBalance;

		if (remainingAmount > 0) {
			return {
				success: false,
				error: `Insufficient wallet balance. Need ${remainingAmount} more to settle the bill.`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Update booking status to confirmed
		const { error: updateError } = await service_client
			.from("bookings")
			.update({
				booking_status: "confirmed",
			})
			.eq("booking_id", bookingId);

		if (updateError) {
			return {
				success: false,
				error: "Failed to settle bill",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: {
				booking_id: bookingId,
				booking_reference: booking.booking_reference,
				total_amount: totalAmount,
				wallet_balance_used: walletBalance,
				remaining_amount: 0,
				booking_status: "confirmed",
				settlement_time: getCurrentISOStringIST(),
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Stripe Payment Services
// ============================================

/**
 * Create a Stripe payment intent for booking payment
 */
export const createPaymentIntent = async (
	token: string,
	userId: string,
	paymentData: CreatePaymentIntentRequest
): Promise<ServiceResponse<PaymentIntentResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);
		const { booking_id, amount } = paymentData;

		// Get booking
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_group_members (user_id)
			`)
			.eq("booking_id", booking_id)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if user is part of the group
		const isMember =
			booking.primary_user_id === userId ||
			booking.booking_group_members.some((m: { user_id: string }) => m.user_id === userId);

		if (!isMember) {
			return {
				success: false,
				error: "Only group members can make payments",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// FR-2.3.9: Check if payment window is active
		if (!isPaymentWindowActive(booking)) {
			return {
				success: false,
				error: "Payment window is not active",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Check booking status
		if (booking.booking_status !== "pending_payment") {
			return {
				success: false,
				error: "Booking is not in pending payment status",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Calculate amount due
		const amountDue = Number(booking.total_amount) - Number(booking.wallet_balance);
		if (amount > amountDue) {
			return {
				success: false,
				error: `Amount exceeds amount due. Maximum payable: ${amountDue}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Get user email for Stripe
		const { data: user, error: userError } = await service_client
			.from("users")
			.select("email")
			.eq("id", userId)
			.single();

		// Create Stripe payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Convert to cents/paise
			currency: "inr",
			metadata: {
				booking_id: booking_id.toString(),
				user_id: userId,
				booking_reference: booking.booking_reference,
			},
			receipt_email: user?.email,
			automatic_payment_methods: {
				enabled: true,
			},
		});

		return {
			success: true,
			data: {
				client_secret: paymentIntent.client_secret || "",
				payment_intent_id: paymentIntent.id,
				amount: amount,
				currency: "inr",
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create payment intent",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Confirm Stripe payment and update booking
 */
export const confirmStripePayment = async (
	token: string,
	userId: string,
	confirmData: ConfirmPaymentRequest
): Promise<ServiceResponse<PaymentConfirmationResponse>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);
		const { booking_id, payment_intent_id } = confirmData;

		// Retrieve payment intent from Stripe
		const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

		if (paymentIntent.status !== "succeeded") {
			return {
				success: false,
				error: `Payment not successful. Status: ${paymentIntent.status}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Verify booking ID matches
		if (paymentIntent.metadata.booking_id !== booking_id.toString()) {
			return {
				success: false,
				error: "Payment intent does not match booking",
				statusCode: STATUS.BADREQUEST,
			};
		}

		const amountPaid = paymentIntent.amount / 100; // Convert from cents

		// Get booking
		const { data: booking, error: bookingError } = await auth_supa
			.from("bookings")
			.select(`*`)
			.eq("booking_id", booking_id)
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Booking not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Record the payment
		const { error: paymentError } = await service_client.from("booking_payments").insert({
			booking_id: booking_id,
			user_id: userId,
			amount: amountPaid,
		});

		if (paymentError) {
			console.error("Error recording payment:", paymentError);
		}

		// Update booking wallet balance
		const newWalletBalance = Number(booking.wallet_balance) + amountPaid;
		const isFullyPaid = newWalletBalance >= Number(booking.total_amount);

		const updateData: any = {
			wallet_balance: newWalletBalance,
		};

		if (isFullyPaid) {
			updateData.booking_status = "confirmed";
		}

		const { error: updateError } = await service_client
			.from("bookings")
			.update(updateData)
			.eq("booking_id", booking_id);

		if (updateError) {
			return {
				success: false,
				error: "Failed to update booking",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: {
				success: true,
				booking_id: booking_id,
				amount_paid: amountPaid,
				booking_status: isFullyPaid ? "confirmed" : "pending_payment",
				wallet_balance: newWalletBalance,
				token_generated: false,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to confirm payment",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Handle Stripe webhook events
 */
export const handleStripeWebhook = async (
	payload: string,
	signature: string
): Promise<ServiceResponse<{ received: boolean }>> => {
	try {
		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
		} catch (err) {
			return {
				success: false,
				error: "Webhook signature verification failed",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Handle the event
		switch (event.type) {
			case "payment_intent.succeeded": {
				const paymentIntent = event.data.object as Stripe.PaymentIntent;
				console.log(`Payment succeeded for booking: ${paymentIntent.metadata.booking_id}`);
				// Additional processing if needed
				break;
			}

			case "payment_intent.payment_failed": {
				const failedPayment = event.data.object as Stripe.PaymentIntent;
				console.log(`Payment failed for booking: ${failedPayment.metadata.booking_id}`);
				break;
			}

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return {
			success: true,
			data: { received: true },
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Webhook processing failed",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// Personal Wallet Recharge Services
// ============================================

/**
 * Create a Stripe Checkout Session for recharging personal wallet (embedded UI mode).
 * Uses Stripe Embedded Checkout so the frontend can render the payment form inline.
 */
export const createWalletRechargeSession = async (
	token: string,
	userId: string,
	amount: number,
	returnUrl: string
): Promise<
	ServiceResponse<{
		client_secret: string;
		session_id: string;
	}>
> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Verify user exists
		const { data: user, error: userError } = await auth_supa
			.from("users")
			.select("id, email, first_name, last_name")
			.eq("id", userId)
			.single();

		if (userError || !user) {
			return {
				success: false,
				error: "User not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Create Stripe Checkout Session in embedded mode
		const session = await stripe.checkout.sessions.create({
			ui_mode: "embedded",
			line_items: [
				{
					price_data: {
						currency: "inr",
						product_data: {
							name: "Wallet Recharge",
							description: `Recharge personal wallet with ₹${amount}`,
						},
						unit_amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit (paise)
					},
					quantity: 1,
				},
			],
			mode: "payment",
			return_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
			metadata: {
				user_id: userId,
				type: "wallet_recharge",
				amount: amount.toString(),
			},
			customer_email: user.email,
		});

		if (!session.client_secret) {
			return {
				success: false,
				error: "Failed to create checkout session – no client secret returned",
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: {
				client_secret: session.client_secret,
				session_id: session.id,
			},
			statusCode: STATUS.CREATED,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create checkout session",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Confirm wallet recharge after successful Stripe Checkout Session payment.
 * Validates session is paid, inserts wallet_transactions record, and updates users.wallet_balance.
 */
export const confirmWalletRecharge = async (
	token: string,
	userId: string,
	sessionId: string
): Promise<
	ServiceResponse<{
		user_id: string;
		amount_recharged: number;
		new_balance: number;
		transaction_id: string;
	}>
> => {
	try {
		// Retrieve the checkout session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Verify session belongs to this user
		if (session.metadata?.user_id !== userId) {
			return {
				success: false,
				error: "Session does not belong to this user",
				statusCode: STATUS.FORBIDDEN,
			};
		}

		// Verify session is for wallet recharge
		if (session.metadata?.type !== "wallet_recharge") {
			return {
				success: false,
				error: "Session is not a wallet recharge session",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Verify payment is complete
		if (session.status !== "complete" || session.payment_status !== "paid") {
			return {
				success: false,
				error: "Payment has not been completed yet",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Check if this session was already processed (idempotency)
		const { data: existingTx, error: existingTxError } = await service_client
			.from("wallet_transactions")
			.select("id")
			.eq("session_id", sessionId)
			.eq("user_id", userId)
			.eq("transaction_type", "recharge")
			.maybeSingle();

		if (existingTx) {
			// Already processed – return current balance
			const { data: user } = await service_client
				.from("users")
				.select("wallet_balance")
				.eq("id", userId)
				.single();

			return {
				success: true,
				data: {
					user_id: userId,
					amount_recharged: (session.amount_total || 0) / 100,
					new_balance: Number(user?.wallet_balance || 0),
					transaction_id: existingTx.id,
				},
				statusCode: STATUS.SUCCESS,
			};
		}

		const rechargeAmount = (session.amount_total || 0) / 100; // Convert from paise to rupees

		// Get current wallet balance
		const { data: currentUser, error: userError } = await service_client
			.from("users")
			.select("wallet_balance")
			.eq("id", userId)
			.single();

		if (userError || !currentUser) {
			return {
				success: false,
				error: "User not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const newBalance = Number(currentUser.wallet_balance) + rechargeAmount;

		// Insert wallet_transactions record
		const { data: transaction, error: txError } = await service_client
			.from("wallet_transactions")
			.insert({
				user_id: userId,
				amount: rechargeAmount,
				transaction_type: "recharge",
				session_id: sessionId,
				description: `Wallet recharge via Stripe Checkout – ₹${rechargeAmount}`,
			})
			.select("id")
			.single();

		if (txError || !transaction) {
			return {
				success: false,
				error: "Failed to record wallet transaction",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Update wallet_balance in users table
		const { error: updateError } = await service_client
			.from("users")
			.update({ wallet_balance: newBalance })
			.eq("id", userId);

		if (updateError) {
			return {
				success: false,
				error: "Failed to update wallet balance",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Also insert into wallet_topups for audit
		await service_client.from("wallet_topups").insert({
			user_id: userId,
			amount: rechargeAmount,
			payment_method: "stripe",
			gateway_transaction_id: sessionId,
			status: "success",
		});

		return {
			success: true,
			data: {
				user_id: userId,
				amount_recharged: rechargeAmount,
				new_balance: newBalance,
				transaction_id: transaction.id,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to confirm wallet recharge",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get user's personal wallet balance
 */
export const getWalletBalance = async (
	token: string,
	userId: string
): Promise<ServiceResponse<{ wallet_balance: number }>> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		const { data: user, error: userError } = await auth_supa
			.from("users")
			.select("wallet_balance")
			.eq("id", userId)
			.single();

		if (userError || !user) {
			return {
				success: false,
				error: "User not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		return {
			success: true,
			data: { wallet_balance: Number(user.wallet_balance) },
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get the status of a Stripe Checkout Session.
 * Useful for polling session status during payment on the frontend.
 */
export const getCheckoutSessionStatus = async (
	sessionId: string
): Promise<
	ServiceResponse<{
		session_id: string;
		status: string;
		payment_status: string;
		amount_total: number;
		customer_email: string | null;
	}>
> => {
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		return {
			success: true,
			data: {
				session_id: session.id,
				status: session.status || "unknown",
				payment_status: session.payment_status || "unknown",
				amount_total: session.amount_total || 0,
				customer_email: (session.customer_details?.email || session.customer_email) ?? null,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to retrieve session status",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get user's wallet transaction history
 */
export const getWalletTransactions = async (
	token: string,
	userId: string,
	limit = 20,
	offset = 0
): Promise<
	ServiceResponse<{
		transactions: any[];
		total_count: number;
	}>
> => {
	try {
		const auth_supa = getAuthenticatedClient(token);

		// Get transactions
		const { data: transactions, error: transError } = await auth_supa
			.from("wallet_transactions")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (transError) {
			return {
				success: false,
				error: "Failed to fetch transactions",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Get total count
		const { count, error: countError } = await auth_supa
			.from("wallet_transactions")
			.select("*", { count: "exact", head: true })
			.eq("user_id", userId);

		return {
			success: true,
			data: {
				transactions: transactions || [],
				total_count: count || 0,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// FR-2.3.1, FR-2.3.2: No-Show Handling Services
// ============================================

/**
 * FR-2.3.1, FR-2.3.2: Mark tokens as no-show and remove from queue
 * Also processes bookings without tokens (unpaid bookings with expired payment window)
 * Releases food items back to slot_menu_mapping as leftover_quantity for walk-ins
 * This should be called when slot time starts
 */
export const processNoShows = async (slotId: number): Promise<ServiceResponse<NoShowToken[]>> => {
	try {
		// Get the slot details
		const { data: slot, error: slotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", slotId)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const noShowTokens: NoShowToken[] = [];
		let totalCapacityReleased = 0;

		// ============================================
		// Part 1: Process bookings with tokens that are not served (traditional no-shows)
		// ============================================
		const { data: tokens, error: tokensError } = await service_client
			.from("tokens")
			.select(`
				*,
				bookings!inner (
					*,
					meal_slots!inner (*),
					booking_menu_items (*)
				)
			`)
			.eq("bookings.slot_id", slotId)
			.in("token_status", ["pending"]);

		if (tokensError) {
			return {
				success: false,
				error: "Failed to fetch tokens",
				statusCode: STATUS.SERVERERROR,
			};
		}

		for (const tokenData of tokens || []) {
			// FR-2.3.1: Mark token as no-show
			await service_client
				.from("tokens")
				.update({ token_status: "no_show" })
				.eq("token_id", tokenData.token_id);

			// Update booking status
			await service_client
				.from("bookings")
				.update({ booking_status: "no_show" })
				.eq("booking_id", tokenData.booking_id);

			// Release food items back to slot_menu_mapping as leftover
			for (const menuItem of tokenData.bookings.booking_menu_items || []) {
				const { data: mapping } = await service_client
					.from("slot_menu_mapping")
					.select("*")
					.eq("slot_id", slotId)
					.eq("menu_item_id", menuItem.menu_item_id)
					.single();

				if (mapping) {
					const newReservedQty = Math.max(0, (mapping.reserved_quantity || 0) - menuItem.quantity);
					const newLeftoverQty = (mapping.leftover_quantity || 0) + menuItem.quantity;

					await service_client
						.from("slot_menu_mapping")
						.update({
							reserved_quantity: newReservedQty,
							leftover_quantity: newLeftoverQty,
							is_available: true,
						})
						.eq("mapping_id", mapping.mapping_id);
				}
			}

			// Track capacity to release
			totalCapacityReleased += tokenData.bookings.group_size || 1;

			// Record user behavior
			await service_client.from("user_behavior").insert({
				user_id: tokenData.bookings.primary_user_id,
				event_type: "no_show",
				event_date: slot.slot_date,
				notes: `No-show for booking ${tokenData.bookings.booking_reference} in slot ${slot.slot_name}`,
			});

			// Update user restrictions
			await updateUserNoShowRestriction(tokenData.bookings.primary_user_id);

			noShowTokens.push({
				token_id: tokenData.token_id,
				token_number: tokenData.token_number,
				booking_id: tokenData.booking_id,
				booking_reference: tokenData.bookings.booking_reference,
				slot_id: slotId,
				slot_name: slot.slot_name,
				group_size: tokenData.bookings.group_size,
				marked_at: getCurrentISOStringIST(),
			});
		}

		// ============================================
		// Part 2: Process unpaid bookings (no token generated, payment window expired)
		// These are bookings that were never paid for
		// ============================================
		const now = getCurrentISOStringIST();
		const { data: unpaidBookings, error: unpaidError } = await service_client
			.from("bookings")
			.select(`
				*,
				booking_menu_items (*)
			`)
			.eq("slot_id", slotId)
			.eq("booking_status", "pending_payment")
			.lt("payment_deadline", now);

		if (!unpaidError && unpaidBookings) {
			for (const booking of unpaidBookings) {
				// Mark booking as no_show (unpaid)
				await service_client
					.from("bookings")
					.update({ booking_status: "no_show" })
					.eq("booking_id", booking.booking_id);

				// Release food items back to slot_menu_mapping as leftover
				for (const menuItem of booking.booking_menu_items || []) {
					const { data: mapping } = await service_client
						.from("slot_menu_mapping")
						.select("*")
						.eq("slot_id", slotId)
						.eq("menu_item_id", menuItem.menu_item_id)
						.single();

					if (mapping) {
						const newReservedQty = Math.max(
							0,
							(mapping.reserved_quantity || 0) - menuItem.quantity
						);
						const newLeftoverQty = (mapping.leftover_quantity || 0) + menuItem.quantity;

						await service_client
							.from("slot_menu_mapping")
							.update({
								reserved_quantity: newReservedQty,
								leftover_quantity: newLeftoverQty,
								is_available: true,
							})
							.eq("mapping_id", mapping.mapping_id);
					}
				}

				// Track capacity to release
				totalCapacityReleased += booking.group_size || 1;

				// Record user behavior for unpaid no-show
				await service_client.from("user_behavior").insert({
					user_id: booking.primary_user_id,
					event_type: "no_show",
					event_date: slot.slot_date,
					notes: `Unpaid booking ${booking.booking_reference} - payment window expired`,
				});

				// Update user restrictions
				await updateUserNoShowRestriction(booking.primary_user_id);

				// Refund any partial wallet contributions
				const { data: payments } = await service_client
					.from("booking_payments")
					.select("*")
					.eq("booking_id", booking.booking_id);

				for (const payment of payments || []) {
					const { data: user } = await service_client
						.from("users")
						.select("wallet_balance")
						.eq("id", payment.user_id)
						.single();

					if (user) {
						await service_client
							.from("users")
							.update({
								wallet_balance: Number(user.wallet_balance) + Number(payment.amount),
							})
							.eq("id", payment.user_id);
					}
				}

				// Add to result (with null token info since no token was generated)
				noShowTokens.push({
					token_id: 0,
					token_number: "N/A",
					booking_id: booking.booking_id,
					booking_reference: booking.booking_reference,
					slot_id: slotId,
					slot_name: slot.slot_name,
					group_size: booking.group_size,
					marked_at: getCurrentISOStringIST(),
				});
			}
		}

		// ============================================
		// Part 3: Release slot capacity
		// ============================================
		if (totalCapacityReleased > 0) {
			await service_client
				.from("meal_slots")
				.update({
					current_occupancy: Math.max(0, slot.current_occupancy - totalCapacityReleased),
				})
				.eq("slot_id", slotId);
		}

		return {
			success: true,
			data: noShowTokens,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Helper function to update user no-show restrictions
 */
const updateUserNoShowRestriction = async (userId: string): Promise<void> => {
	const { data: existingRestriction } = await service_client
		.from("user_restrictions")
		.select("*")
		.eq("user_id", userId)
		.eq("type", "warning")
		.eq("is_active", true)
		.single();

	if (existingRestriction) {
		const newNoShowCount = (existingRestriction.no_show_count || 0) + 1;
		await service_client
			.from("user_restrictions")
			.update({ no_show_count: newNoShowCount })
			.eq("restriction_id", existingRestriction.restriction_id);

		// If no-show count exceeds threshold, escalate restriction
		if (newNoShowCount >= 3) {
			// Calculate 7 days from now in IST
			const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
			const endDateIST = formatToISTISOString(convertUTCToIST(endDate));
			await service_client.from("user_restrictions").insert({
				user_id: userId,
				type: "temporary_ban",
				reason: `Multiple no-shows (${newNoShowCount} times)`,
				no_show_count: newNoShowCount,
				end_date: endDateIST, // 7 days
			});
		}
	} else {
		// Create warning restriction
		await service_client.from("user_restrictions").insert({
			user_id: userId,
			type: "warning",
			reason: "No-show for meal booking",
			no_show_count: 1,
		});
	}
};

// ============================================
// FR-2.3.3, FR-2.3.4, FR-2.3.5: Walk-In Services
// ============================================

/**
 * FR-2.3.3, FR-2.3.4: Get available meals for walk-in users
 * Returns menu items that have unreserved/leftover quantities in slot_menu_mapping
 */
export const getWalkInAvailableMeals = async (
	slotId?: number,
	date?: string
): Promise<ServiceResponse<WalkInMealItem[]>> => {
	try {
		let targetSlotId = slotId;

		// If no slot specified, get current active slot (IST)
		if (!targetSlotId) {
			const today = date || getCurrentDateStringIST();
			const currentTime = getCurrentTimeStringIST();

			const { data: activeSlot } = await service_client
				.from("meal_slots")
				.select("slot_id")
				.eq("slot_date", today)
				.eq("is_active", true)
				.lte("start_time", currentTime)
				.gte("end_time", currentTime)
				.single();

			targetSlotId = activeSlot?.slot_id;
		}

		if (!targetSlotId) {
			return {
				success: false,
				error: "No active slot found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Get slot details for capacity info
		const { data: slot, error: slotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", targetSlotId)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if slot has available capacity for walk-ins
		const availableCapacity = slot.max_capacity - slot.current_occupancy;
		if (availableCapacity <= 0) {
			return {
				success: true,
				data: [], // No capacity for walk-ins
				statusCode: STATUS.SUCCESS,
			};
		}

		// Get available menu items from slot_menu_mapping
		// Available for walk-in = available_quantity - reserved_quantity (unreserved items)
		// Plus any leftover_quantity from no-shows/cancellations
		const { data: mappings, error: mappingError } = await service_client
			.from("slot_menu_mapping")
			.select(`
				*,
				menu_items (*)
			`)
			.eq("slot_id", targetSlotId)
			.eq("is_available", true);

		if (mappingError) {
			return {
				success: false,
				error: "Failed to fetch available menu items",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const availableMeals: WalkInMealItem[] = (mappings || [])
			.map((mapping: any) => {
				const walkInAvailable = mapping.leftover_quantity || 0;

				if (walkInAvailable <= 0) return null;

				return {
					id: mapping.mapping_id,
					slot_id: mapping.slot_id,
					menu_item_id: mapping.menu_item_id,
					item_name: mapping.menu_items.item_name,
					category: mapping.menu_items.category,
					description: mapping.menu_items.description,
					price: Number(mapping.menu_items.price),
					available_quantity: walkInAvailable,
					image_url: mapping.menu_items.image_url,
					is_vegetarian: mapping.menu_items.is_vegetarian,
				};
			})
			.filter((item): item is WalkInMealItem => item !== null);

		return {
			success: true,
			data: availableMeals,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.3.5: Create walk-in booking for users (staff only)
 * Creates a complete booking for walk-in users with optional cash payment
 * - Fetches user by mobile number
 * - Creates booking with menu items
 * - If cash payment: sets wallet_balance and confirms booking
 * - If ebooking: user pays via their wallet/card later
 */
export const assignWalkInMeal = async (
	staffId: string,
	assignmentData: AssignWalkInMealRequest
): Promise<ServiceResponse<AssignWalkInMealResponse>> => {
	try {
		const {
			slot_id,
			user_mobile_number,
			menu_items,
			booking_type,
			payment_method,
			amount,
			member_count,
		} = assignmentData;
		const auth_supa = getAuthenticatedClient(staffId);

		// ============================================
		// Step 1: Fetch user by mobile number
		// ============================================
		const { data: user, error: userError } = await service_client
			.from("users")
			.select("id, first_name, last_name, email, mobile")
			.eq("mobile", user_mobile_number)
			.single();

		if (userError || !user) {
			return {
				success: false,
				error: "User not found with the provided mobile number",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// ============================================
		// Step 2: Validate slot exists and is active
		// ============================================
		const { data: slot, error: slotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", slot_id)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check slot capacity
		const requiredCapacity = member_count;
		const availableCapacity = slot.max_capacity - slot.current_occupancy;
		if (availableCapacity < requiredCapacity) {
			return {
				success: false,
				error: `Insufficient slot capacity. Available: ${availableCapacity}, Requested: ${requiredCapacity}`,
				statusCode: STATUS.BADREQUEST,
			};
		}

		// ============================================
		// Step 3: Validate and reserve menu items
		// ============================================
		const menuItemDetails: {
			menu_item_id: number;
			item_name: string;
			quantity: number;
			price: number;
			mapping: any;
		}[] = [];
		let totalAmount = 0;

		for (const item of menu_items) {
			// Get menu item mapping for this slot
			const { data: mapping, error: mappingError } = await service_client
				.from("slot_menu_mapping")
				.select(`
					*,
					menu_items (item_name, price)
				`)
				.eq("slot_id", slot_id)
				.eq("menu_item_id", item.menu_item_id)
				.single();

			if (mappingError || !mapping) {
				return {
					success: false,
					error: `Menu item ${item.menu_item_id} not found for this slot`,
					statusCode: STATUS.NOTFOUND,
				};
			}

			// Calculate available for walk-in (unreserved + leftover)
			const unreservedQty = Math.max(
				0,
				(mapping.available_quantity || 0) - (mapping.reserved_quantity || 0)
			);
			const walkInAvailable = mapping.leftover_quantity || 0;

			if (walkInAvailable < item.quantity) {
				return {
					success: false,
					error: `Insufficient quantity for ${mapping.menu_items.item_name}. Available: ${walkInAvailable}, Requested: ${item.quantity}`,
					statusCode: STATUS.BADREQUEST,
				};
			}

			const itemPrice = Number(mapping.menu_items.price) * item.quantity;
			totalAmount += itemPrice;

			menuItemDetails.push({
				menu_item_id: item.menu_item_id,
				item_name: mapping.menu_items.item_name,
				quantity: item.quantity,
				price: Number(mapping.menu_items.price),
				mapping: mapping,
			});
		}

		// ============================================
		// Step 4: Determine payment and booking status
		// ============================================
		const effectivePaymentMethod = payment_method || "ebooking";
		let walletBalance = 0;
		let bookingStatus = "pending_payment";

		if (effectivePaymentMethod === "cash") {
			// Cash payment: use provided amount
			walletBalance = amount || 0;
		}

		// Payment deadline is end of the slot (IST)
		const paymentDeadline = createISTISOString(slot.slot_date, slot.end_time);

		// Generate booking reference
		const bookingReference = generateBookingReference();

		// ============================================
		// Step 5: Create the booking
		// ============================================
		const { data: booking, error: bookingError } = await service_client
			.from("bookings")
			.insert({
				primary_user_id: user.id,
				slot_id: slot_id,
				booking_reference: bookingReference,
				group_size: requiredCapacity,
				total_amount: totalAmount,
				wallet_balance: walletBalance,
				booking_status: bookingStatus,
				booking_type: booking_type,
				payment_deadline: paymentDeadline,
			})
			.select()
			.single();

		if (bookingError || !booking) {
			return {
				success: false,
				error: "Failed to create booking",
				statusCode: STATUS.SERVERERROR,
			};
		}

		// ============================================
		// Step 6: Create booking menu items and update slot_menu_mapping
		// ============================================
		for (const itemDetail of menuItemDetails) {
			// Insert booking menu item
			await service_client.from("booking_menu_items").insert({
				booking_id: booking.booking_id,
				menu_item_id: itemDetail.menu_item_id,
				quantity: itemDetail.quantity,
				unit_price: itemDetail.price,
			});

			// Update slot_menu_mapping - deduct from leftover first, then unreserved
			const mapping = itemDetail.mapping;
			let remainingToDeduct = itemDetail.quantity;
			let newLeftoverQty = mapping.leftover_quantity || 0;
			let newReservedQty = mapping.reserved_quantity || 0;

			// Deduct from leftover first
			if (newLeftoverQty > 0 && remainingToDeduct > 0) {
				const deductFromLeftover = Math.min(newLeftoverQty, remainingToDeduct);
				newLeftoverQty -= deductFromLeftover;
				remainingToDeduct -= deductFromLeftover;
			}

			// If still remaining, add to reserved (from unreserved pool)
			if (remainingToDeduct > 0) {
				newReservedQty += remainingToDeduct;
			}

			await service_client
				.from("slot_menu_mapping")
				.update({
					reserved_quantity: newReservedQty,
					leftover_quantity: newLeftoverQty,
					is_available: mapping.available_quantity > newReservedQty || newLeftoverQty > 0,
				})
				.eq("mapping_id", mapping.mapping_id);
		}

		// ============================================
		// Step 7: Update slot occupancy
		// ============================================
		await service_client
			.from("meal_slots")
			.update({
				current_occupancy: slot.current_occupancy + requiredCapacity,
			})
			.eq("slot_id", slot_id);

		return {
			success: true,
			data: {
				success: true,
				booking_id: booking.booking_id,
				booking_reference: bookingReference,
				user_id: user.id,
				user_name: `${user.first_name} ${user.last_name}`,
				booking_type: booking_type,
				total_amount: totalAmount,
				wallet_balance: walletBalance,
				booking_status: bookingStatus,
				payment_deadline: paymentDeadline,
				menu_items: menuItemDetails.map((item) => ({
					menu_item_id: item.menu_item_id,
					item_name: item.item_name,
					quantity: item.quantity,
					price: item.price,
				})),
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// FR-2.3.6, FR-2.3.7: No-Show Reporting Services
// ============================================

/**
 * FR-2.3.6: Track no-show frequency per slot
 */
export const getNoShowFrequencyReport = async (
	startDate: string,
	endDate: string,
	slotId?: number
): Promise<ServiceResponse<NoShowFrequencyReport>> => {
	try {
		// Build query for slots in date range
		let slotsQuery = service_client
			.from("meal_slots")
			.select("*")
			.gte("slot_date", startDate)
			.lte("slot_date", endDate)
			.order("slot_date", { ascending: true });

		if (slotId) {
			slotsQuery = slotsQuery.eq("slot_id", slotId);
		}

		const { data: slots, error: slotsError } = await slotsQuery;

		if (slotsError) {
			return {
				success: false,
				error: "Failed to fetch slots",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const slotStats: NoShowStats[] = [];
		let totalBookings = 0;
		let totalNoShows = 0;

		for (const slot of slots || []) {
			// Get bookings for this slot
			const { data: bookings, error: bookingsError } = await service_client
				.from("bookings")
				.select("booking_status")
				.eq("slot_id", slot.slot_id);

			if (bookingsError) continue;

			const slotTotalBookings = bookings?.length || 0;
			const slotNoShows = bookings?.filter((b) => b.booking_status === "no_show").length || 0;

			totalBookings += slotTotalBookings;
			totalNoShows += slotNoShows;

			slotStats.push({
				slot_id: slot.slot_id,
				slot_name: slot.slot_name,
				slot_date: slot.slot_date,
				total_bookings: slotTotalBookings,
				no_show_count: slotNoShows,
				no_show_rate:
					slotTotalBookings > 0 ? Math.round((slotNoShows / slotTotalBookings) * 100) : 0,
			});
		}

		return {
			success: true,
			data: {
				date_range: { start: startDate, end: endDate },
				total_slots: slots?.length || 0,
				total_bookings: totalBookings,
				total_no_shows: totalNoShows,
				overall_no_show_rate:
					totalBookings > 0 ? Math.round((totalNoShows / totalBookings) * 100) : 0,
				slots: slotStats,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.3.7: Generate report on unused slots
 */
export const getUnusedSlotsReport = async (
	date: string
): Promise<ServiceResponse<UnusedSlotsReport>> => {
	try {
		const { data: slots, error: slotsError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_date", date)
			.order("start_time", { ascending: true });

		if (slotsError) {
			return {
				success: false,
				error: "Failed to fetch slots",
				statusCode: STATUS.SERVERERROR,
			};
		}

		let totalUnusedCapacity = 0;
		let totalCapacity = 0;
		let totalOccupancy = 0;

		const slotReports = (slots || []).map((slot) => {
			const unusedCapacity = slot.max_capacity - slot.current_occupancy;
			const utilizationRate =
				slot.max_capacity > 0 ? Math.round((slot.current_occupancy / slot.max_capacity) * 100) : 0;

			totalUnusedCapacity += unusedCapacity;
			totalCapacity += slot.max_capacity;
			totalOccupancy += slot.current_occupancy;

			return {
				slot_id: slot.slot_id,
				slot_name: slot.slot_name,
				max_capacity: slot.max_capacity,
				final_occupancy: slot.current_occupancy,
				unused_capacity: unusedCapacity,
				utilization_rate: utilizationRate,
			};
		});

		return {
			success: true,
			data: {
				date,
				slots: slotReports,
				total_unused_capacity: totalUnusedCapacity,
				overall_utilization_rate:
					totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.3.7: Generate report on unused meals
 */
export const getUnusedMealsReport = async (
	date: string,
	slotId?: number
): Promise<ServiceResponse<UnusedMealsReport[]>> => {
	try {
		let slotsQuery = service_client.from("meal_slots").select("*").eq("slot_date", date);

		if (slotId) {
			slotsQuery = slotsQuery.eq("slot_id", slotId);
		}

		const { data: slots, error: slotsError } = await slotsQuery;

		if (slotsError) {
			return {
				success: false,
				error: "Failed to fetch slots",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const reports: UnusedMealsReport[] = [];

		for (const slot of slots || []) {
			// Get slot menu mappings with item details
			const { data: mappings, error: mappingsError } = await service_client
				.from("slot_menu_mapping")
				.select(`
					*,
					menu_items (item_name)
				`)
				.eq("slot_id", slot.slot_id);

			if (mappingsError) continue;

			let totalPrepared = 0;
			let totalConsumed = 0;
			let totalLeftover = 0;

			const items = (mappings || []).map((mapping: any) => {
				const prepared = mapping.available_quantity || 0;
				const consumed = mapping.consumed_quantity || 0;
				const leftover = mapping.leftover_quantity || 0;

				totalPrepared += prepared;
				totalConsumed += consumed;
				totalLeftover += leftover;

				return {
					menu_item_id: mapping.menu_item_id,
					item_name: mapping.menu_items.item_name,
					prepared_quantity: prepared,
					consumed_quantity: consumed,
					leftover_quantity: leftover,
					waste_percentage: prepared > 0 ? Math.round((leftover / prepared) * 100) : 0,
				};
			});

			reports.push({
				date,
				slot_id: slot.slot_id,
				slot_name: slot.slot_name,
				items,
				total_prepared: totalPrepared,
				total_consumed: totalConsumed,
				total_leftover: totalLeftover,
				overall_waste_percentage:
					totalPrepared > 0 ? Math.round((totalLeftover / totalPrepared) * 100) : 0,
			});
		}

		return {
			success: true,
			data: reports,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// FR-2.3.13, FR-2.3.14: Auto-Cancellation Services
// ============================================

/**
 * FR-2.3.13: Auto-cancel bookings if payment not completed within window
 * FR-2.3.14: Release slot capacity and food resources after cancellation
 */
export const processExpiredPaymentWindows = async (): Promise<
	ServiceResponse<AutoCancellationResult[]>
> => {
	try {
		const now = getCurrentISOStringIST();

		// Find all pending_payment bookings with expired payment deadline
		const { data: expiredBookings, error: bookingsError } = await service_client
			.from("bookings")
			.select(`
				*,
				meal_slots (*),
				booking_menu_items (*)
			`)
			.eq("booking_status", "pending_payment")
			.lt("payment_deadline", now);

		if (bookingsError) {
			return {
				success: false,
				error: "Failed to fetch expired bookings",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const cancellationResults: AutoCancellationResult[] = [];

		for (const booking of expiredBookings || []) {
			// FR-2.3.14: Release resources
			const { capacityReleased, foodResourcesReleased } = await releaseBookingResources(
				booking.booking_id
			);

			// Cancel the booking
			await service_client
				.from("bookings")
				.update({ booking_status: "cancelled" })
				.eq("booking_id", booking.booking_id);

			// Cancel associated token if exists
			await service_client
				.from("tokens")
				.update({ token_status: "cancelled" })
				.eq("booking_id", booking.booking_id);

			// Refund any wallet contributions back to users
			const { data: payments } = await service_client
				.from("booking_payments")
				.select("*")
				.eq("booking_id", booking.booking_id);

			for (const payment of payments || []) {
				// Refund to user wallet
				const { data: user } = await service_client
					.from("users")
					.select("wallet_balance")
					.eq("id", payment.user_id)
					.single();

				if (user) {
					await service_client
						.from("users")
						.update({
							wallet_balance: Number(user.wallet_balance) + Number(payment.amount),
						})
						.eq("id", payment.user_id);
				}
			}

			cancellationResults.push({
				booking_id: booking.booking_id,
				booking_reference: booking.booking_reference,
				reason: "Payment window expired",
				cancelled_at: now,
				slot_capacity_released: capacityReleased,
				food_resources_released: foodResourcesReleased,
			});
		}

		return {
			success: true,
			data: cancellationResults,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

// ============================================
// FR-2.3.16, FR-2.3.17: Leftover Food Services
// ============================================

/**
 * FR-2.3.16: Detect leftover food portions in last 5 minutes of slot
 */
export const detectLeftoverFood = async (
	slotId: number
): Promise<ServiceResponse<LeftoverFood[]>> => {
	try {
		const { data: slot, error: slotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", slotId)
			.single();

		if (slotError || !slot) {
			return {
				success: false,
				error: "Slot not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		// Check if we're in the last 5 minutes of the slot (IST)
		const now = new Date();
		const slotEnd = createISTDate(slot.slot_date, slot.end_time);
		const fiveMinutesBefore = new Date(slotEnd.getTime() - 5 * 60 * 1000);

		const isInLastFiveMinutes = now >= fiveMinutesBefore && now <= slotEnd;

		// Get next slot to check transfer eligibility
		const { data: nextSlot } = await service_client
			.from("meal_slots")
			.select("slot_id")
			.eq("slot_date", slot.slot_date)
			.gt("start_time", slot.end_time)
			.order("start_time", { ascending: true })
			.limit(1)
			.single();

		// Get leftover items
		const { data: mappings, error: mappingsError } = await service_client
			.from("slot_menu_mapping")
			.select(`
				*,
				menu_items (item_name)
			`)
			.eq("slot_id", slotId)
			.gt("leftover_quantity", 0);

		if (mappingsError) {
			return {
				success: false,
				error: "Failed to fetch leftover data",
				statusCode: STATUS.SERVERERROR,
			};
		}

		const leftovers: LeftoverFood[] = (mappings || []).map((mapping: any) => ({
			slot_id: slotId,
			slot_name: slot.slot_name,
			menu_item_id: mapping.menu_item_id,
			item_name: mapping.menu_items.item_name,
			leftover_quantity: mapping.leftover_quantity,
			can_transfer_to_next_slot: isInLastFiveMinutes && nextSlot !== null,
		}));

		return {
			success: true,
			data: leftovers,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * FR-2.3.17: Transfer leftover food to next slot
 */
export const transferLeftoverToNextSlot = async (
	transferData: LeftoverTransferRequest
): Promise<ServiceResponse<LeftoverTransferResponse>> => {
	try {
		const { from_slot_id, to_slot_id, items } = transferData;

		// Verify slots exist
		const { data: fromSlot, error: fromSlotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", from_slot_id)
			.single();

		const { data: toSlot, error: toSlotError } = await service_client
			.from("meal_slots")
			.select("*")
			.eq("slot_id", to_slot_id)
			.single();

		if (fromSlotError || !fromSlot || toSlotError || !toSlot) {
			return {
				success: false,
				error: "Invalid slot IDs",
				statusCode: STATUS.BADREQUEST,
			};
		}

		// Verify to_slot is after from_slot (IST)
		const fromEnd = createISTDate(fromSlot.slot_date, fromSlot.end_time);
		const toStart = createISTDate(toSlot.slot_date, toSlot.start_time);

		if (toStart <= fromEnd) {
			return {
				success: false,
				error: "Can only transfer to a subsequent slot",
				statusCode: STATUS.BADREQUEST,
			};
		}

		const transfers: any[] = [];

		for (const item of items) {
			// Get source mapping
			const { data: fromMapping, error: fromMappingError } = await service_client
				.from("slot_menu_mapping")
				.select("*")
				.eq("slot_id", from_slot_id)
				.eq("menu_item_id", item.menu_item_id)
				.single();

			if (fromMappingError || !fromMapping) {
				continue;
			}

			if (fromMapping.leftover_quantity < item.quantity) {
				continue;
			}

			// Get or create target mapping
			let { data: toMapping } = await service_client
				.from("slot_menu_mapping")
				.select("*")
				.eq("slot_id", to_slot_id)
				.eq("menu_item_id", item.menu_item_id)
				.single();

			if (!toMapping) {
				// Create new mapping for target slot
				const { data: newMapping, error: insertError } = await service_client
					.from("slot_menu_mapping")
					.insert({
						slot_id: to_slot_id,
						menu_item_id: item.menu_item_id,
						available_quantity: item.quantity,
						reserved_quantity: 0,
						leftover_quantity: item.quantity,
						is_available: true,
					})
					.select()
					.single();

				if (insertError || !newMapping) {
					continue;
				}
				toMapping = newMapping;
			} else {
				// Update existing mapping
				await service_client
					.from("slot_menu_mapping")
					.update({
						available_quantity: toMapping.available_quantity + item.quantity,
						leftover_quantity: toMapping.leftover_quantity + item.quantity,
					})
					.eq("mapping_id", toMapping.mapping_id);
			}

			// Update source mapping
			await service_client
				.from("slot_menu_mapping")
				.update({
					leftover_quantity: fromMapping.leftover_quantity - item.quantity,
				})
				.eq("mapping_id", fromMapping.mapping_id);

			transfers.push({
				from_slot_id,
				to_slot_id,
				menu_item_id: item.menu_item_id,
				quantity: item.quantity,
				transferred_at: getCurrentISOStringIST(),
			});
		}

		return {
			success: true,
			data: {
				success: true,
				transfers,
				message: `Successfully transferred ${transfers.length} items to next slot`,
			},
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Update slot_menu_mapping leftover quantities from no-show meals
 * This releases the reserved portions back to leftover for walk-in availability
 */
export const updateWalkInInventoryFromNoShows = async (
	slotId: number
): Promise<ServiceResponse<{ items_updated: number; capacity_released: number }>> => {
	try {
		// Get no-show bookings for this slot
		const { data: noShowBookings, error: bookingsError } = await service_client
			.from("bookings")
			.select(`
				*,
				booking_menu_items (*)
			`)
			.eq("slot_id", slotId)
			.eq("booking_status", "no_show");

		if (bookingsError) {
			return {
				success: false,
				error: "Failed to fetch no-show bookings",
				statusCode: STATUS.SERVERERROR,
			};
		}

		let itemsUpdated = 0;
		let capacityReleased = 0;

		for (const booking of noShowBookings || []) {
			capacityReleased += booking.group_size || 1;

			for (const menuItem of booking.booking_menu_items) {
				// Get the slot_menu_mapping for this item
				const { data: mapping, error: mappingError } = await service_client
					.from("slot_menu_mapping")
					.select("*")
					.eq("slot_id", slotId)
					.eq("menu_item_id", menuItem.menu_item_id)
					.single();

				if (mappingError || !mapping) continue;

				// Release reserved quantity to leftover (available for walk-ins)
				const newReservedQty = Math.max(0, (mapping.reserved_quantity || 0) - menuItem.quantity);
				const newLeftoverQty = (mapping.leftover_quantity || 0) + menuItem.quantity;

				await service_client
					.from("slot_menu_mapping")
					.update({
						reserved_quantity: newReservedQty,
						leftover_quantity: newLeftoverQty,
						is_available: true, // Make available for walk-ins
					})
					.eq("mapping_id", mapping.mapping_id);

				itemsUpdated++;
			}
		}

		// Update slot capacity (release no-show occupancy)
		if (capacityReleased > 0) {
			const { data: slot } = await service_client
				.from("meal_slots")
				.select("current_occupancy")
				.eq("slot_id", slotId)
				.single();

			if (slot) {
				await service_client
					.from("meal_slots")
					.update({
						current_occupancy: Math.max(0, slot.current_occupancy - capacityReleased),
					})
					.eq("slot_id", slotId);
			}
		}

		return {
			success: true,
			data: { items_updated: itemsUpdated, capacity_released: capacityReleased },
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};
