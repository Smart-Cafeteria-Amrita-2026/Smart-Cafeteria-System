// tokenService.test.ts
import * as tokenService from "../../src/services/tokenService";

// Mock the service module
jest.mock("../../src/services/tokenService", () => ({
	generateToken: jest.fn(),
	getUserTokens: jest.fn(),
	markTokenAsServed: jest.fn(),
	getServiceCounters: jest.fn(),
	getQueueProgress: jest.fn(),
}));

describe("Token Service Tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("generateToken returns success and data", async () => {
		const mockData = {
			token_id: 1,
			token_number: "TK-001",
			booking_reference: "REF001",
			booking_id: 1,
			group_size: 2,
			slot_details: {
				slot_id: 1,
				slot_name: "Lunch",
				slot_date: "2024-01-01",
				start_time: "12:00",
				end_time: "13:00",
			},
			message: "Token generated",
		};

		(tokenService.generateToken as jest.Mock).mockResolvedValue({
			success: true,
			data: mockData,
			statusCode: 201,
		});

		const result = await tokenService.generateToken("auth-token", "user-123", 1);

		// 1. Assert success
		expect(result.success).toBe(true);

		// 2. Use a type guard or check existence to satisfy TypeScript
		if (result.success && result.data) {
			expect(result.data.token_number).toBe("TK-001");
			expect(result.data.group_size).toBe(2);
		}
	});

	test("markTokenAsServed updates status", async () => {
		(tokenService.markTokenAsServed as jest.Mock).mockResolvedValue({
			success: true,
			data: { token_id: 1, token_status: "served" },
			statusCode: 200,
		});

		const result = await tokenService.markTokenAsServed(1);

		expect(result.success).toBe(true);

		// Alternative: use non-null assertion if you are 100% sure in the test context
		expect(result.data!.token_status).toBe("served");
	});

	test("getServiceCounters returns list of counters", async () => {
		(tokenService.getServiceCounters as jest.Mock).mockResolvedValue({
			success: true,
			data: [{ counter_id: 1, counter_name: "Counter 1" }],
			statusCode: 200,
		});

		const result = await tokenService.getServiceCounters();

		expect(result.success).toBe(true);
		if (result.success && result.data) {
			expect(result.data[0].counter_name).toBe("Counter 1");
		}
	});
});
