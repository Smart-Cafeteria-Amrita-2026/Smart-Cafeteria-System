// backend/__tests__/routes/bookingRoutes.test.ts
import { describe, test, expect } from "@jest/globals";
import { Router } from "express";

describe("Booking Routes - Basic Test", () => {
	test("Express Router should be available", () => {
		// Test that Express Router exists
		expect(typeof Router).toBe("function");
	});

	test("should create a router instance", () => {
		const router = Router();
		expect(router).toBeDefined();
		expect(typeof router).toBe("function");
	});
});
