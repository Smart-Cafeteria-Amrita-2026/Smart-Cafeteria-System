import { apiPost } from "@/src/lib/api";
import type { FeedbackPayload, FeedbackResponse } from "@/src/types/feedback.types";

/**
 * FeedbackService
 * Handles all feedback-related API calls
 */
export const FeedbackService = {
	/**
	 * Submit feedback for a served token
	 */
	submitFeedback: (payload: FeedbackPayload): Promise<FeedbackResponse> =>
		apiPost<FeedbackResponse>("/api/feedback", payload),
};
