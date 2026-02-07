import { apiPost } from "@/lib/api";

export interface StripeSessionResponse {
	clientSecret: string;
}

export const StripeService = {
	/**
	 * Creates a Stripe Checkout Session for a specific booking.
	 * @param bookingId The ID of the booking to pay for.
	 * @returns The client secret needed for the Embedded Checkout.
	 */
	createCheckoutSession: (bookingId: string): Promise<StripeSessionResponse> =>
		apiPost<StripeSessionResponse>("/payments/create-checkout-session", { bookingId }),
};
