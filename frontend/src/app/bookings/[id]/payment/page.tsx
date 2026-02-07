"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StripeCheckout } from "@/components/payment/StripeCheckout";
import { useStripeCheckout } from "@/hooks/payment/useStripeCheckout";
import { StripeSessionResponse } from "@/services/payment/StripeService";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function BookingPaymentPage() {
	const { id } = useParams();
	const router = useRouter();
	const { mutate: createSession, data, isPending, isError } = useStripeCheckout();
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			createSession(id as string, {
				onSuccess: (data: StripeSessionResponse) => setClientSecret(data.clientSecret),
			});
		}
	}, [id, createSession]);

	return (
		<div className="mx-auto max-w-2xl p-4 md:p-8 space-y-6">
			<header className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={24} />
				</button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
					<p className="text-gray-500 text-sm">Secure checkout powered by Stripe</p>
				</div>
			</header>

			<div className="rounded-3xl bg-gray-50 p-1 min-h-[400px] flex items-center justify-center">
				{isPending && (
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="animate-spin text-blue-600" size={32} />
						<p className="text-gray-500 font-medium">Preparing secure checkout...</p>
					</div>
				)}

				{isError && (
					<div className="text-center p-8 space-y-4">
						<div className="bg-red-50 text-red-600 p-4 rounded-2xl font-medium">
							Failed to initialize payment. Please check your connection.
						</div>
						<button
							onClick={() => window.location.reload()}
							className="text-blue-600 font-bold hover:underline"
						>
							Retry Payment
						</button>
					</div>
				)}

				{clientSecret && <StripeCheckout clientSecret={clientSecret} />}
			</div>

			<p className="text-center text-xs text-gray-400">
				Your payment information is encrypted and never stored on our servers.
			</p>
		</div>
	);
}
