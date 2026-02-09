import {
	TOKEN_STATUS,
	TokenStatusType,
	ServiceCounter,
	ServiceCounterWithQueue,
	Token,
	TokenWithDetails,
	TokenQueueItem,
	QueueProgress,
	OverallQueueStatus,
	GenerateTokenRequest,
	ActivateTokenRequest,
	AssignCounterRequest,
	MarkTokenServedRequest,
	ReassignTokensRequest,
	TokenGenerationResponse,
	TokenActivationResponse,
	CounterClosureResponse,
	CounterStatusUpdate,
	TokenReassignment,
	UserQueueStatus,
} from "../../src/interfaces/token.types";

describe("Token Types", () => {
	test("TOKEN_STATUS should have correct values", () => {
		expect(TOKEN_STATUS).toEqual([
			"pending",
			"active",
			"serving",
			"served",
			"cancelled",
			"no_show",
		]);
	});

	test("TokenStatusType should be valid", () => {
		const status: TokenStatusType = "active";
		expect(TOKEN_STATUS.includes(status)).toBe(true);
	});

	test("ServiceCounter interface should have required properties", () => {
		const counter: ServiceCounter = {
			counter_id: 1,
			counter_name: "Counter 1",
			is_active: true,
		};
		expect(counter.counter_id).toBeDefined();
		expect(counter.counter_name).toBeDefined();
		expect(typeof counter.is_active).toBe("boolean");
	});

	test("ServiceCounterWithQueue extends ServiceCounter", () => {
		const counterWithQueue: ServiceCounterWithQueue = {
			counter_id: 1,
			counter_name: "Counter 1",
			is_active: true,
			current_queue_length: 5,
			estimated_wait_time: 15,
			current_serving_token: "TK-001",
		};
		expect(counterWithQueue.current_queue_length).toBeDefined();
		expect(counterWithQueue.estimated_wait_time).toBeDefined();
	});

	test("Token interface should have required properties", () => {
		const token: Token = {
			token_id: 1,
			booking_id: 1,
			token_number: "TK-001",
			counter_id: 1,
			token_status: "pending",
			activated_at: null,
			served_at: null,
		};
		expect(token.token_number).toBeDefined();
		expect(TOKEN_STATUS.includes(token.token_status)).toBe(true);
	});

	test("TokenWithDetails extends Token", () => {
		const tokenWithDetails: TokenWithDetails = {
			token_id: 1,
			booking_id: 1,
			token_number: "TK-001",
			counter_id: 1,
			token_status: "active",
			activated_at: "2024-01-01T10:00:00Z",
			served_at: null,
			booking_reference: "REF001",
			slot_details: {
				slot_id: 1,
				slot_name: "Lunch",
				slot_date: "2024-01-01",
				start_time: "12:00",
				end_time: "13:00",
			},
			counter_details: {
				counter_id: 1,
				counter_name: "Counter 1",
				is_active: true,
			},
			queue_position: 2,
			estimated_wait_time: 10,
			group_members: [
				{
					user_id: "user1",
					first_name: "John",
					last_name: "Doe",
				},
			],
		};
		expect(tokenWithDetails.booking_reference).toBeDefined();
		expect(tokenWithDetails.slot_details).toBeDefined();
	});

	test("GenerateTokenRequest should have correct structure", () => {
		const request: GenerateTokenRequest = {
			booking_id: 1,
		};
		expect(typeof request.booking_id).toBe("number");
	});

	test("UserQueueStatus should have queue information", () => {
		const queueStatus: UserQueueStatus = {
			token_id: 1,
			token_number: "TK-001",
			token_status: "active",
			counter_id: 1,
			counter_name: "Counter 1",
			queue_position: 3,
			estimated_wait_time: 9,
			currently_serving: { token_number: "TK-002" },
			tokens_ahead: 2,
		};
		expect(queueStatus.queue_position).toBeGreaterThanOrEqual(0);
		expect(queueStatus.tokens_ahead).toBeGreaterThanOrEqual(0);
	});
});
