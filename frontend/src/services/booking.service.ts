import { apiGet } from "@/src/lib/api";
import { API_ROUTES } from "@/src/lib/routes";
import type { SlotsResponse, MealType, Booking, MenuResponse } from "@/src/types/booking.types";

interface BookingsResponse {
	success: boolean;
	message: string;
	data: Booking[];
}

/**
 * BookingService
 * Handles all booking-related API calls
 */
export const BookingService = {
	/**
	 * Get all available slots for today
	 * Public endpoint - no auth required
	 */
	getAvailableSlots: (): Promise<SlotsResponse> =>
		apiGet<SlotsResponse>(API_ROUTES.BOOKINGS.SLOTS, { skipAuth: true }),

	/**
	 * Get slots for a specific meal type
	 * Public endpoint - no auth required
	 */
	getSlotsByType: (type: MealType): Promise<SlotsResponse> =>
		apiGet<SlotsResponse>(`${API_ROUTES.BOOKINGS.SLOTS}?meal_type=${type}`, { skipAuth: true }),

	/**
	 * Get menu items for a specific slot
	 * Public endpoint - no auth required
	 */
	getMenuBySlotId: (slotId: string): Promise<MenuResponse> =>
		apiGet<MenuResponse>(`${API_ROUTES.BOOKINGS.SLOTS}/${slotId}/menu`, { skipAuth: true }),

	/**
	 * Get user's bookings
	 * Protected endpoint - requires auth
	 */
	getBookings: (): Promise<BookingsResponse> => apiGet<BookingsResponse>("/api/bookings"),
};
