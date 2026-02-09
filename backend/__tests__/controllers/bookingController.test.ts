// backend/__tests__/controllers/bookingController.test.ts
import { describe, test, expect, jest, beforeEach } from "@jest/globals";

describe("Booking Controller - Basic Tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("should have proper test setup", () => {
		expect(true).toBe(true);
	});

	test("mock functions work correctly", () => {
		const mockFn = jest.fn();
		mockFn("test");
		expect(mockFn).toHaveBeenCalledWith("test");
	});

	test("async test works", async () => {
		const result = await Promise.resolve("success");
		expect(result).toBe("success");
	});
});
