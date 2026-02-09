// ============================================
// Queue Status Types (for SSE real-time updates)
// ============================================

import type { TokenStatusType } from "./token.types";

export interface QueueStatusData {
	token_id: number;
	token_number: string;
	token_status: TokenStatusType;
	counter_id: number;
	counter_name: string;
	queue_position: number;
	estimated_wait_time: number;
	currently_serving: {
		token_number: string;
	} | null;
	tokens_ahead: number;
}

export type QueueSSEEvent =
	| { type: "connected"; data: { token_id: number } }
	| { type: "queue_update"; data: QueueStatusData }
	| { type: "queue_ended"; data: { error: string } };
