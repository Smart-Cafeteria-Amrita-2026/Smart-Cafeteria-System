// Enums
export const BOOKING_STATUS = [
	"pending_payment",
	"confirmed",
	"cancelled",
	"completed",
	"no_show",
] as const;

export type BookingStatusType = (typeof BOOKING_STATUS)[number];

export const BOOKING_TYPE = ["dine-in", "take-away"] as const;

export type BookingType = (typeof BOOKING_TYPE)[number];

export const MENU_CATEGORY = ["breakfast", "lunch", "dinner", "snacks", "beverages"] as const;

export type MenuCategoryType = (typeof MENU_CATEGORY)[number];

// Meal Slot Types
export interface MealSlot {
	slot_id: number;
	slot_name: string;
	slot_date: string;
	start_time: string;
	end_time: string;
	max_capacity: number;
	current_occupancy: number;
	is_active: boolean;
	payment_window_start: string;
	payment_window_end: string;
	created_at: string;
}

export interface MealSlotWithAvailability extends MealSlot {
	remaining_capacity: number;
	is_full: boolean;
	occupancy_percentage: number;
}

// Menu Item Types
export interface MenuItem {
	menu_item_id: number;
	item_name: string;
	category: MenuCategoryType;
	description: string | null;
	price: number;
	image_url: string | null;
	is_vegetarian: boolean;
	is_available: boolean;
	created_at: string;
	total_stock: number;
}

export interface SlotMenuItem extends MenuItem {
	available_quantity: number;
	reserved_quantity: number;
	is_slot_available: boolean;
}

// Booking Types
export interface Booking {
	booking_id: number;
	booking_reference: string;
	slot_id: number;
	primary_user_id: string;
	is_group_booking: boolean;
	group_size: number;
	booking_type: BookingType;
	booking_status: BookingStatusType;
	total_amount: number;
	wallet_balance: number;
	payment_deadline: string;
	created_at: string;
}

export interface BookingMenuItem {
	id: number;
	booking_id: number;
	menu_item_id: number;
	user_id: string;
	quantity: number;
	unit_price: number;
	subtotal: number;
}

export interface BookingGroupMember {
	member_id: number;
	booking_id: number;
	user_id: string;
	joined_at: string;
}

// Request Types
export interface CreateBookingRequest {
	slot_id: number;
	group_size: number;
	booking_type?: BookingType;
	menu_items: {
		menu_item_id: number;
		quantity: number;
	}[];
	group_member_ids?: string[];
	total_amount: number;
}

export interface UpdateBookingRequest {
	menu_items_add?: {
		menu_item_id: number;
		quantity: number;
	}[];
	menu_items_remove?: {
		menu_item_id: number;
		quantity: number;
	}[];
	group_member_ids_add?: string[];
	group_member_ids_remove?: string[];
}

export interface AddGroupMemberRequest {
	user_id: string;
	menu_items?: {
		menu_item_id: number;
		quantity: number;
	}[];
}

export interface MenuSearchRequest {
	slot_id: number;
	search_text?: string;
	category?: MenuCategoryType;
	is_vegetarian?: boolean;
}

// Response Types
export interface BookingResponse extends Booking {
	slot: MealSlot;
	menu_items: (BookingMenuItem & { item_details: MenuItem })[];
	group_members: BookingGroupMember[];
}

export interface SlotRecommendation {
	slot: MealSlotWithAvailability;
	recommendation_reason: string;
	predicted_demand: "low" | "medium" | "high";
}

export interface BookingConfirmation {
	booking_id: number;
	booking_reference: string;
	slot_details: MealSlot;
	total_amount: number;
	payment_deadline: string;
	group_size: number;
	is_group_booking: boolean;
	booking_type: BookingType;
}

export interface SlotCapacityUpdate {
	slot_id: number;
	current_occupancy: number;
	remaining_capacity: number;
	is_full: boolean;
}

export interface UserSearchResult {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	college_id: string;
}

// Demand Analysis Types
export interface DemandAnalysis {
	slot_id: number;
	slot_name: string;
	slot_date: string;
	current_bookings: number;
	predicted_demand: number;
	demand_level: "low" | "medium" | "high";
	historical_average: number;
}
