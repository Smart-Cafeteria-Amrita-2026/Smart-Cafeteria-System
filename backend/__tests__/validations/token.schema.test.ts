import {
	tokenIdParamSchema,
	counterIdParamSchema,
	slotIdParamSchema,
	generateTokenSchema,
	activateTokenSchema,
	assignCounterSchema,
	markTokenServedSchema,
	closeCounterSchema,
	getQueueStatusSchema,
	tokenStatusFilterSchema,
	updateCounterStatusSchema,
	getUserTokensQuerySchema,
} from "../../src/validations/token.schema";

describe("Token Schemas", () => {
	describe("paramSchemas", () => {
		test("tokenIdParamSchema should validate numeric ID", () => {
			expect(() => tokenIdParamSchema.parse({ tokenId: "123" })).not.toThrow();
			expect(() => tokenIdParamSchema.parse({ tokenId: "abc" })).toThrow();
		});

		test("counterIdParamSchema should validate numeric ID", () => {
			expect(() => counterIdParamSchema.parse({ counterId: "456" })).not.toThrow();
			expect(() => counterIdParamSchema.parse({ counterId: "xyz" })).toThrow();
		});
	});

	describe("generateTokenSchema", () => {
		test("should validate token generation", () => {
			const valid = { booking_id: 1 };
			expect(() => generateTokenSchema.parse(valid)).not.toThrow();
		});
	});

	describe("activateTokenSchema", () => {
		test("should validate token activation", () => {
			const valid = { token_id: 1 };
			expect(() => activateTokenSchema.parse(valid)).not.toThrow();
		});
	});

	describe("assignCounterSchema", () => {
		test("should validate counter assignment", () => {
			const valid = { token_id: 1, counter_id: 1 };
			expect(() => assignCounterSchema.parse(valid)).not.toThrow();
		});
	});

	describe("markTokenServedSchema", () => {
		test("should validate token serving", () => {
			const valid = { token_id: 1 };
			expect(() => markTokenServedSchema.parse(valid)).not.toThrow();
		});
	});

	describe("closeCounterSchema", () => {
		test("should validate counter closure with reason", () => {
			const valid = { counter_id: 1, reason: "Maintenance" };
			expect(() => closeCounterSchema.parse(valid)).not.toThrow();
		});

		test("should validate counter closure without reason", () => {
			const valid = { counter_id: 1 };
			expect(() => closeCounterSchema.parse(valid)).not.toThrow();
		});
	});

	describe("getQueueStatusSchema", () => {
		test("should validate queue status query with date", () => {
			const valid = { slot_id: "1", date: "2024-01-01" };
			expect(() => getQueueStatusSchema.parse(valid)).not.toThrow();
		});

		test("should validate queue status query without parameters", () => {
			const valid = {};
			expect(() => getQueueStatusSchema.parse(valid)).not.toThrow();
		});

		test("should reject invalid date format", () => {
			const invalid = { date: "01-01-2024" };
			expect(() => getQueueStatusSchema.parse(invalid)).toThrow();
		});
	});

	describe("tokenStatusFilterSchema", () => {
		test("should validate status filter", () => {
			const valid = { status: "active" };
			expect(() => tokenStatusFilterSchema.parse(valid)).not.toThrow();
		});

		test("should allow undefined status", () => {
			const valid = {};
			expect(() => tokenStatusFilterSchema.parse(valid)).not.toThrow();
		});
	});
});
