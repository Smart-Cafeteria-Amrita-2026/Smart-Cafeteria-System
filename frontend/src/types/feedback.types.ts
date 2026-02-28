export interface FeedbackPayload {
	booking_id: number;
	token_id: number;
	rating: number; // 1-5
	comment?: string;
}

export interface FeedbackResponse {
	success: boolean;
	message: string;
	data?: {
		feedback_id: number;
	};
}
