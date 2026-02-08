export type MealType = "breakfast" | "lunch" | "snack" | "dinner";
export type BookingStatus = "COMPLETED" | "CONFIRMED" | "CANCELLED" | "PENDING";

// Slot data from the backend GET /api/bookings/slots response
export interface SlotData {
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
	remaining_capacity: number;
	is_full: boolean;
	occupancy_percentage: number;
}

export interface SlotsResponse {
	success: boolean;
	message: string;
	data: SlotData[];
}

// Meal category configuration for the grid
export interface MealCategoryConfig {
	id: MealType;
	title: string;
	caption: string;
	image: string;
	href: string;
}

export interface Slot {
	id: string;
	startTime: string;
	endTime: string;
	availableSeats: number;
	totalSeats: number;
}

export interface BookingSession {
	mealType: MealType | null;
	slotId: string | null;
	members: number;
}

// Booking item for cart/order
export interface BookingItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
}

// Full booking object
export interface Booking {
	id: string;
	status: BookingStatus;
	items: BookingItem[];
	totalAmount: number;
	date: string;
	slot: string;
	mealType: MealType;
	members: number;
}

// Menu item from backend GET /api/bookings/slots/:slotId/menu
export interface MenuItemData {
	menu_item_id: number;
	item_name: string;
	description: string;
	price: number;
	category: string;
	image_url: string;
	is_available: boolean;
	is_vegetarian: boolean;
	total_stock: number;
	available_quantity: number;
	reserved_quantity: number;
	is_slot_available: boolean;
	created_at: string;
}

export interface MenuResponse {
	success: boolean;
	message: string;
	data: MenuItemData[];
}

// User search result for group booking member selection
export interface UserSearchResult {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	college_id: string;
}

export interface UserSearchResponse {
	success: boolean;
	data: UserSearchResult[];
}

export type BookingType = "dine-in" | "take-away";

// Create booking request payload
export interface CreateBookingPayload {
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

export interface CreateBookingResponse {
	success: boolean;
	message: string;
	data: {
		booking_id: number;
		booking_reference: string;
		slot_details: SlotData;
		total_amount: number;
		payment_deadline: string;
		group_size: number;
		is_group_booking: boolean;
		booking_type: BookingType;
	};
}
