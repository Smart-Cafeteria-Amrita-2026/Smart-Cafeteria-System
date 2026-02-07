"use client";

import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

// Replace with your actual publishable key or an env variable
const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

interface Props {
	clientSecret: string;
	onComplete?: () => void;
}

export function StripeCheckout({ clientSecret }: Props) {
	const options = useMemo(() => ({ clientSecret }), [clientSecret]);

	return (
		<div
			id="checkout"
			className="min-h-[600px] w-full bg-white rounded-2xl overflow-hidden shadow-sm"
		>
			<EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</div>
	);
}
