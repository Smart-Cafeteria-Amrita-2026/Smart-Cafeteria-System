import {
	getPaymentWindowSchema,
	createPaymentIntentSchema,
	settleBillSchema,
} from "../../src/validations/payment.schema";

describe("Payment Schema Validation", () => {
	describe("getPaymentWindowSchema", () => {
		test("valid booking ID should pass", () => {
			const valid = { booking_id: 1 };
			expect(() => getPaymentWindowSchema.parse(valid)).not.toThrow();
		});

		test("invalid booking ID should fail", () => {
			const invalid = { booking_id: 0 };
			expect(() => getPaymentWindowSchema.parse(invalid)).toThrow();
		});
	});

	describe("createPaymentIntentSchema", () => {
		test("valid payment intent should pass", () => {
			const valid = { booking_id: 1, amount: 100 };
			expect(() => createPaymentIntentSchema.parse(valid)).not.toThrow();
		});
	});

	describe("settleBillSchema", () => {
		test("valid settle bill should pass", () => {
			const valid = { booking_id: 1 };
			expect(() => settleBillSchema.parse(valid)).not.toThrow();
		});
	});
});
