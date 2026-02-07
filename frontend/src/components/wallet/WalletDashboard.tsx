"use client";

import { useWalletBalance, useCreateCheckoutSession } from "@/hooks/wallet/useWallet";
import { WalletDisplay } from "./WalletDisplay";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function WalletDashboard() {
	const router = useRouter();
	const { data: walletData, isLoading } = useWalletBalance();
	const { mutate: createSession, isPending: isSessionPending } = useCreateCheckoutSession();

	const handleTopUp = (amount: number) => {
		// Build the return_url pointing to the success page where we verify + confirm
		const returnUrl = `${window.location.origin}/wallet/topup/success`;

		createSession(
			{ amount, return_url: returnUrl },
			{
				onSuccess: (res) => {
					const { client_secret, session_id } = res.data;
					// Navigate to the embedded checkout page, passing the client secret & session id
					router.push(`/wallet/topup/${session_id}?secret=${encodeURIComponent(client_secret)}`);
				},
			}
		);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-12">
				<Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
				<p className="text-gray-500 font-medium">Syncing your wallet...</p>
			</div>
		);
	}

	return (
		<WalletDisplay
			balance={walletData?.wallet_balance ?? 0}
			currency="INR"
			onTopUp={handleTopUp}
			isTopUpPending={isSessionPending}
		/>
	);
}
