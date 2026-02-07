// Token Status Enum
export const TOKEN_STATUS = [
	"pending",
	"active",
	"serving",
	"served",
	"cancelled",
	"no_show",
] as const;

export type TokenStatusType = (typeof TOKEN_STATUS)[number];

// Service Counter Types
export interface ServiceCounter {
	counter_id: number;
	counter_name: string;
	is_active: boolean;
}

export interface ServiceCounterWithQueue extends ServiceCounter {
	current_queue_length: number;
	estimated_wait_time: number; // in minutes
	current_serving_token: string | null;
}

// Token Types
export interface Token {
	token_id: number;
	booking_id: number;
	token_number: string;
	counter_id: number | null;
	token_status: TokenStatusType;
	activated_at: string | null;
	served_at: string | null;
}

export interface TokenWithDetails extends Token {
	booking_reference: string;
	slot_details: {
		slot_id: number;
		slot_name: string;
		slot_date: string;
		start_time: string;
		end_time: string;
	};
	counter_details: ServiceCounter | null;
	queue_position: number | null;
	estimated_wait_time: number | null;
	group_members: {
		user_id: string;
		first_name: string;
		last_name: string;
	}[];
}

export interface TokenQueueItem {
	token_id: number;
	token_number: string;
	booking_reference: string;
	counter_id: number | null;
	token_status: TokenStatusType;
	queue_position: number;
	group_size: number;
	activated_at: string | null;
}

// Queue Progress Types
export interface QueueProgress {
	counter_id: number;
	counter_name: string;
	currently_serving: TokenQueueItem | null;
	next_in_queue: TokenQueueItem[];
	total_in_queue: number;
	average_serving_time: number; // in minutes
}

export interface OverallQueueStatus {
	slot_id: number;
	slot_name: string;
	total_tokens: number;
	pending_tokens: number;
	activated_tokens: number;
	serving_tokens: number;
	served_tokens: number;
	counters: QueueProgress[];
}

// Request Types
export interface GenerateTokenRequest {
	booking_id: number;
}

export interface ActivateTokenRequest {
	token_id: number;
}

export interface AssignCounterRequest {
	token_id: number;
	counter_id: number;
}

export interface MarkTokenServedRequest {
	token_id: number;
}

export interface ReassignTokensRequest {
	closed_counter_id: number;
}

// Response Types
export interface TokenGenerationResponse {
	token_id: number;
	token_number: string;
	booking_reference: string;
	booking_id: number;
	group_size: number;
	slot_details: {
		slot_id: number;
		slot_name: string;
		slot_date: string;
		start_time: string;
		end_time: string;
	};
	message: string;
}

export interface TokenActivationResponse {
	token_id: number;
	token_number: string;
	counter_id: number;
	counter_name: string;
	queue_position: number;
	estimated_wait_time: number;
	activated_at: string;
}

export interface CounterClosureResponse {
	closed_counter_id: number;
	reassigned_tokens: number;
	reassignment_details: {
		token_id: number;
		token_number: string;
		old_counter_id: number;
		new_counter_id: number;
		new_queue_position: number;
	}[];
}

// Counter Management Types
export interface CounterStatusUpdate {
	counter_id: number;
	is_active: boolean;
	reason?: string;
}

export interface TokenReassignment {
	token_id: number;
	token_number: string;
	old_counter_id: number;
	new_counter_id: number;
	new_queue_position: number;
	notified: boolean;
}
