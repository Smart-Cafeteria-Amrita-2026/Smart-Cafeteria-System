import { useMutation } from "@tanstack/react-query";
import { StripeService, StripeSessionResponse } from "@/services/payment/StripeService";
import { toast } from "react-hot-toast";

export function useStripeCheckout() {
	return useMutation<StripeSessionResponse, Error, string>({
		mutationFn: (bookingId: string) => StripeService.createCheckoutSession(bookingId),
		onError: (error: any) => {
			console.error("Stripe Session Error:", error);
			toast.error("Failed to initialize payment. Please try again.");
		},
	});
}
