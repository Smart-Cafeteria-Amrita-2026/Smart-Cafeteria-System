// ============================================
// Token Types (mirrors backend token.types.ts)
// ============================================

export type TokenStatusType = "pending" | "active" | "serving" | "served" | "cancelled" | "no_show";

export interface TokenSlotDetails {
	slot_id: number;
	slot_name: string;
	slot_date: string;
	start_time: string;
	end_time: string;
}

export interface TokenCounterDetails {
	counter_id: number;
	counter_name: string;
	is_active: boolean;
}

export interface TokenGroupMember {
	user_id: string;
	first_name: string;
	last_name: string;
}

/** Full token details returned by GET /api/tokens/:tokenId and GET /api/tokens/booking/:ref */
export interface TokenWithDetails {
	token_id: number;
	booking_id: number;
	token_number: string;
	counter_id: number | null;
	token_status: TokenStatusType;
	activated_at: string | null;
	served_at: string | null;
	booking_reference: string;
	slot_details: TokenSlotDetails;
	counter_details: TokenCounterDetails | null;
	queue_position: number | null;
	estimated_wait_time: number | null;
	group_members: TokenGroupMember[];
}

/** Response from POST /api/tokens/generate */
export interface TokenGenerationResponse {
	token_id: number;
	token_number: string;
	booking_reference: string;
	booking_id: number;
	group_size: number;
	slot_details: TokenSlotDetails;
	message: string;
}

/** Wrapper shape returned by the backend */
export interface TokenApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}
