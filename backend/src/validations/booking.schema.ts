import { z } from "zod";
import { BOOKING_STATUS, BOOKING_TYPE, MENU_CATEGORY } from "../interfaces/booking.types";

// Menu item selection schema
const menuItemSelectionSchema = z.object({
	menu_item_id: z.number().int().positive("Menu item ID must be a positive integer"),
	//NEED TO BE DISCUSSED
	// quantity: z.number().int().min(1, "Quantity must be at least 1").max(10, "Quantity cannot exceed 10"),
	quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Create booking schema
export const createBookingSchema = z.object({
	slot_id: z.number().int().positive("Slot ID must be a positive integer"),
	group_size: z
		.number()
		.int()
		.min(1, "Group size must be at least 1")
		.max(6, "Group size cannot exceed 6"),
	booking_type: z.enum(BOOKING_TYPE).optional().default("dine-in"),
	menu_items: z.array(menuItemSelectionSchema).min(1, "At least one menu item must be selected"),
	group_member_ids: z
		.array(z.string().uuid("Invalid user ID format"))
		.max(5, "Cannot add more than 5 additional group members")
		.optional(),
	total_amount: z.number().positive("Total cost must be a positive number"),
});

// Update booking schema
export const updateBookingSchema = z.object({
	menu_items_add: z
		.array(menuItemSelectionSchema)
		.min(1, "At least one menu item must be provided to add")
		.optional(),
	menu_items_remove: z
		.array(menuItemSelectionSchema)
		.min(1, "At least one menu item must be provided to remove")
		.optional(),
	group_member_ids_add: z
		.array(z.string().uuid("Invalid user ID format"))
		.max(5, "Cannot add more than 5 group members at once")
		.optional(),
	group_member_ids_remove: z
		.array(z.string().uuid("Invalid user ID format"))
		.max(5, "Cannot remove more than 5 group members at once")
		.optional(),
});

// Cancel booking schema
export const cancelBookingSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
	cancellation_reason: z.string().max(500, "Reason cannot exceed 500 characters").optional(),
});

// Add group member schema
export const addGroupMemberSchema = z.object({
	user_id: z.string().uuid("Invalid user ID format"),
	menu_items: z.array(menuItemSelectionSchema).optional(),
});

// Menu search schema
export const menuSearchSchema = z.object({
	slot_id: z.number().int().positive("Slot ID must be a positive integer"),
	search_text: z.string().max(200, "Search text cannot exceed 200 characters").optional(),
	category: z.enum(MENU_CATEGORY).optional(),
	is_vegetarian: z.boolean().optional(),
});

// Get available slots schema
export const getAvailableSlotsSchema = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
		.optional(),
	meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
});

// Slot recommendation schema
export const slotRecommendationSchema = z.object({
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
	group_size: z
		.number()
		.int()
		.min(1, "Group size must be at least 1")
		.max(6, "Group size cannot exceed 6")
		.optional()
		.default(1),
});

// Booking ID param schema
export const bookingIdParamSchema = z.object({
	bookingId: z.string().regex(/^\d+$/, "Booking ID must be a number"),
});

// Slot ID param schema
export const slotIdParamSchema = z.object({
	slotId: z.string().regex(/^\d+$/, "Slot ID must be a number"),
});

// Search users schema
export const searchUsersSchema = z.object({
	email: z.string().min(2, "Search query must be at least 2 characters").max(100),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type AddGroupMemberInput = z.infer<typeof addGroupMemberSchema>;
export type MenuSearchInput = z.infer<typeof menuSearchSchema>;
export type GetAvailableSlotsInput = z.infer<typeof getAvailableSlotsSchema>;
export type SlotRecommendationInput = z.infer<typeof slotRecommendationSchema>;
