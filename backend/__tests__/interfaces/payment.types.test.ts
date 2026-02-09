import {
	PAYMENT_STATUS,
	PAYMENT_METHOD,
	PaymentStatusType,
	PaymentMethodType,
} from "../../src/interfaces/payment.types";

describe("Payment Types", () => {
	test("PAYMENT_STATUS should have correct values", () => {
		expect(PAYMENT_STATUS).toEqual(["pending", "completed", "failed", "refunded"]);
	});

	test("PAYMENT_METHOD should have correct values", () => {
		expect(PAYMENT_METHOD).toEqual(["wallet", "stripe", "cash"]);
	});

	test("PaymentStatusType should accept valid values", () => {
		const validStatus: PaymentStatusType = "pending";
		expect(PAYMENT_STATUS.includes(validStatus)).toBe(true);
	});

	test("PaymentMethodType should accept valid values", () => {
		const validMethod: PaymentMethodType = "stripe";
		expect(PAYMENT_METHOD.includes(validMethod)).toBe(true);
	});
});
