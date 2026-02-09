import {
	createBookingSchema,
	cancelBookingSchema,
	bookingIdParamSchema,
} from "../../src/validations/booking.schema";

describe("Booking Schema Validation", () => {
	describe("createBookingSchema", () => {
		test("valid booking should pass", () => {
			const valid = {
				slot_id: 1,
				group_size: 2,
				menu_items: [{ menu_item_id: 1, quantity: 2 }],
				total_amount: 100,
			};
			expect(() => createBookingSchema.parse(valid)).not.toThrow();
		});
	});

	describe("cancelBookingSchema", () => {
		test("valid cancellation should pass", () => {
			const valid = { booking_id: 1 };
			expect(() => cancelBookingSchema.parse(valid)).not.toThrow();
		});
	});

	describe("bookingIdParamSchema", () => {
		test("valid booking ID should pass", () => {
			const valid = { bookingId: "123" };
			expect(() => bookingIdParamSchema.parse(valid)).not.toThrow();
		});
	});
});
