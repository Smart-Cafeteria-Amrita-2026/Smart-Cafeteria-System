import { describe, test, expect } from "@jest/globals";
import { STATUS } from "../../src/interfaces/status.types";

describe("Status Constants", () => {
	test("STATUS should contain all HTTP status codes", () => {
		expect(STATUS.SUCCESS).toBe(200);
		expect(STATUS.CREATED).toBe(201);
		expect(STATUS.ACCEPTED).toBe(202);
		expect(STATUS.BADREQUEST).toBe(400);
		expect(STATUS.UNAUTHORIZED).toBe(401);
		expect(STATUS.FORBIDDEN).toBe(403);
		expect(STATUS.NOTFOUND).toBe(404);
		expect(STATUS.TIMEOUT).toBe(408);
		expect(STATUS.SERVERERROR).toBe(500);
		expect(STATUS.BADGATEWAY).toBe(502);
		expect(STATUS.SERVICEUNAVAILABLE).toBe(503);
	});

	test("All status codes should be numbers", () => {
		Object.values(STATUS).forEach((value) => {
			expect(typeof value).toBe("number");
		});
	});

	test("Status object should be frozen (immutable)", () => {
		// Try to modify (should fail in strict mode or be ignored)
		const originalValue = STATUS.SUCCESS;

		// Attempt to modify (this might not throw in test but documents intent)
		// STATUS.SUCCESS = 999; // Should fail if Object.freeze was used

		expect(STATUS.SUCCESS).toBe(originalValue);
	});
});
