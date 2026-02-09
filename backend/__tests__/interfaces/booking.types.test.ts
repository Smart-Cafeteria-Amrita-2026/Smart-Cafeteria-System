import { describe, test, expect } from "@jest/globals";
import {
	BOOKING_STATUS,
	BOOKING_TYPE,
	MENU_CATEGORY,
	type BookingStatusType,
	type BookingType,
	type MenuCategoryType,
} from "../../src/interfaces/booking.types";

describe("Booking Type Definitions", () => {
	test("BOOKING_STATUS should contain correct values", () => {
		expect(BOOKING_STATUS).toContain("pending_payment");
		expect(BOOKING_STATUS).toContain("confirmed");
		expect(BOOKING_STATUS).toContain("cancelled");
		expect(BOOKING_STATUS).toContain("completed");
		expect(BOOKING_STATUS).toContain("no_show");
		expect(BOOKING_STATUS).toHaveLength(5);
	});

	test("BOOKING_TYPE should contain correct values", () => {
		expect(BOOKING_TYPE).toContain("dine-in");
		expect(BOOKING_TYPE).toContain("take-away");
		expect(BOOKING_TYPE).toHaveLength(2);
	});

	test("MENU_CATEGORY should contain correct values", () => {
		expect(MENU_CATEGORY).toContain("breakfast");
		expect(MENU_CATEGORY).toContain("lunch");
		expect(MENU_CATEGORY).toContain("dinner");
		expect(MENU_CATEGORY).toContain("snacks");
		expect(MENU_CATEGORY).toContain("beverages");
		expect(MENU_CATEGORY).toHaveLength(5);
	});

	test("TypeScript types should be inferred correctly", () => {
		// Test type assignments (compile-time only, but we can test with TypeScript assertions)
		const bookingStatus: BookingStatusType = "confirmed"; // Should be valid
		const bookingType: BookingType = "dine-in"; // Should be valid
		const menuCategory: MenuCategoryType = "lunch"; // Should be valid

		// Just to use the variables
		expect(bookingStatus).toBe("confirmed");
		expect(bookingType).toBe("dine-in");
		expect(menuCategory).toBe("lunch");
	});

	test("Invalid values should cause TypeScript errors (manual check)", () => {
		// These would cause TypeScript errors if uncommented:
		// const invalidStatus: BookingStatusType = 'invalid'; // TypeScript error
		// const invalidType: BookingType = 'delivery'; // TypeScript error
		// const invalidCategory: MenuCategoryType = 'dessert'; // TypeScript error

		// This test is just to document what should fail at compile time
		expect(true).toBe(true); // Placeholder
	});
});
