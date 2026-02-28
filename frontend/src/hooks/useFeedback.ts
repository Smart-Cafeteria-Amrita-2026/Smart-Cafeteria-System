import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FeedbackService } from "@/src/services/feedback.service";
import type { FeedbackPayload } from "@/src/types/feedback.types";

/**
 * Hook for submitting feedback.
 * Shows toast feedback on success/error.
 */
export function useSubmitFeedback() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: FeedbackPayload) => FeedbackService.submitFeedback(payload),
		onSuccess: (response) => {
			toast.success(response.message || "Thank you for your feedback!");
			// We might want to invalidate booking detail to reflect feedback was given
			queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
		},
		onError: () => {
			toast.error("Failed to submit feedback. Please try again.");
		},
	});
}
