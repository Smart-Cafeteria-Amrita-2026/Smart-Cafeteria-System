// Payment Status Types
export const PAYMENT_STATUS = ["pending", "completed", "failed", "refunded"] as const;
export type PaymentStatusType = (typeof PAYMENT_STATUS)[number];

// Payment Method Types
export const PAYMENT_METHOD = ["wallet", "stripe", "cash"] as const;
export type PaymentMethodType = (typeof PAYMENT_METHOD)[number];

// ============================================
// Payment Window Types
// ============================================
export interface PaymentWindow {
	booking_id: number;
	booking_reference: string;
	window_start: string;
	window_end: string;
	is_active: boolean;
	time_remaining_minutes: number;
	total_amount: number;
	wallet_balance: number;
	amount_due: number;
}

export interface PaymentWindowExtension {
	booking_id: number;
	new_deadline: string;
	extended_by_minutes: number;
	extended_by_admin_id: string;
}

// ============================================
// Booking Wallet Types
// ============================================
export interface BookingWalletContribution {
	id: string;
	booking_id: number;
	user_id: string;
	amount: number;
	payment_method: PaymentMethodType;
	created_at: string;
}

export interface WalletContributionRequest {
	booking_id: number;
	amount: number;
	payment_method_id?: string; // Stripe payment method ID
}

export interface WalletContributionResponse {
	contribution_id: string;
	booking_id: number;
	amount_contributed: number;
	booking_wallet_balance: number;
	total_amount: number;
	remaining_to_pay: number;
	is_fully_paid: boolean;
}

// ============================================
// Stripe Payment Types
// ============================================
export interface CreatePaymentIntentRequest {
	booking_id: number;
	amount: number;
}

export interface PaymentIntentResponse {
	client_secret: string;
	payment_intent_id: string;
	amount: number;
	currency: string;
}

export interface ConfirmPaymentRequest {
	booking_id: number;
	payment_intent_id: string;
}

export interface PaymentConfirmationResponse {
	success: boolean;
	booking_id: number;
	amount_paid: number;
	booking_status: string;
	wallet_balance: number;
	token_generated: boolean;
	token_number?: string;
}

// ============================================
// Bill Settlement Types
// ============================================
export interface BillSettlementRequest {
	booking_id: number;
}

export interface BillSettlementResponse {
	booking_id: number;
	booking_reference: string;
	total_amount: number;
	wallet_balance_used: number;
	remaining_amount: number;
	booking_status: string;
	settlement_time: string;
}

// ============================================
// No-Show Types
// ============================================
export interface NoShowToken {
	token_id: number;
	token_number: string;
	booking_id: number;
	booking_reference: string;
	slot_id: number;
	slot_name: string;
	group_size: number;
	marked_at: string;
}

export interface NoShowStats {
	slot_id: number;
	slot_name: string;
	slot_date: string;
	total_bookings: number;
	no_show_count: number;
	no_show_rate: number;
}

export interface NoShowFrequencyReport {
	date_range: {
		start: string;
		end: string;
	};
	total_slots: number;
	total_bookings: number;
	total_no_shows: number;
	overall_no_show_rate: number;
	slots: NoShowStats[];
}

// ============================================
// Walk-In Types
// ============================================
export interface WalkInMealItem {
	id: number;
	slot_id: number;
	menu_item_id: number;
	item_name: string;
	category: string;
	description: string | null;
	price: number;
	available_quantity: number;
	image_url: string | null;
	is_vegetarian: boolean;
}

export interface WalkInAssignment {
	id: number;
	slot_id: number;
	menu_item_id: number;
	quantity: number;
	assigned_by_staff_id: string;
	assigned_at: string;
}

// Booking type for walk-in
export type BookingType = "dine-in" | "take-away";

// Payment method for walk-in
export type WalkInPaymentMethod = "cash" | "ebooking";

export interface WalkInMenuItem {
	menu_item_id: number;
	quantity: number;
}

export interface AssignWalkInMealRequest {
	slot_id: number;
	user_mobile_number: string;
	menu_items: WalkInMenuItem[];
	booking_type: BookingType;
	payment_method?: WalkInPaymentMethod;
	amount?: number; // Required when payment_method is "cash"
	member_count: number;
}

export interface AssignWalkInMealResponse {
	success: boolean;
	booking_id: number;
	booking_reference: string;
	user_id: string;
	user_name: string;
	booking_type: BookingType;
	total_amount: number;
	wallet_balance: number;
	booking_status: string;
	payment_deadline: string;
	menu_items: {
		menu_item_id: number;
		item_name: string;
		quantity: number;
		price: number;
	}[];
}

// ============================================
// Leftover Food Types
// ============================================
export interface LeftoverFood {
	slot_id: number;
	slot_name: string;
	menu_item_id: number;
	item_name: string;
	leftover_quantity: number;
	can_transfer_to_next_slot: boolean;
}

export interface LeftoverTransfer {
	from_slot_id: number;
	to_slot_id: number;
	menu_item_id: number;
	quantity: number;
	transferred_at: string;
}

export interface LeftoverTransferRequest {
	from_slot_id: number;
	to_slot_id: number;
	items: {
		menu_item_id: number;
		quantity: number;
	}[];
}

export interface LeftoverTransferResponse {
	success: boolean;
	transfers: LeftoverTransfer[];
	message: string;
}

// ============================================
// Report Types
// ============================================
export interface UnusedSlotsReport {
	date: string;
	slots: {
		slot_id: number;
		slot_name: string;
		max_capacity: number;
		final_occupancy: number;
		unused_capacity: number;
		utilization_rate: number;
	}[];
	total_unused_capacity: number;
	overall_utilization_rate: number;
}

export interface UnusedMealsReport {
	date: string;
	slot_id: number;
	slot_name: string;
	items: {
		menu_item_id: number;
		item_name: string;
		prepared_quantity: number;
		consumed_quantity: number;
		leftover_quantity: number;
		waste_percentage: number;
	}[];
	total_prepared: number;
	total_consumed: number;
	total_leftover: number;
	overall_waste_percentage: number;
}

// ============================================
// Cancellation Types
// ============================================
export interface AutoCancellationResult {
	booking_id: number;
	booking_reference: string;
	reason: string;
	cancelled_at: string;
	slot_capacity_released: number;
	food_resources_released: {
		menu_item_id: number;
		quantity: number;
	}[];
}

export interface BookingCancellationNotification {
	user_id: string;
	booking_id: number;
	booking_reference: string;
	reason: string;
	notification_type: "email" | "push" | "sms";
}

// ============================================
// Personal Wallet Recharge Types
// ============================================
export interface WalletRechargeRequest {
	amount: number;
}

export interface WalletRechargeIntentResponse {
	client_secret: string;
	session_id: string;
	amount: number;
	currency: string;
}

export interface ConfirmWalletRechargeRequest {
	session_id: string;
}

export interface WalletRechargeConfirmationResponse {
	success: boolean;
	amount_recharged: number;
	new_wallet_balance: number;
	transaction_id: string;
}

export interface WalletBalance {
	user_id: string;
	wallet_balance: number;
}

export interface WalletTransaction {
	id: string;
	user_id: string;
	amount: number;
	transaction_type: "recharge" | "contribution" | "refund";
	session_id: string | null;
	description: string;
	created_at: string;
}
