"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, XCircle, Loader2 } from "lucide-react";
import { useSessionStatus, useConfirmRecharge } from "@/hooks/wallet/useWallet";

function SuccessContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const sessionId = searchParams.get("session_id");

	const { data: sessionData, isLoading: isStatusLoading } = useSessionStatus(sessionId);
	const {
		mutate: confirmRecharge,
		isPending: isConfirming,
		isSuccess,
		isError,
	} = useConfirmRecharge();

	// Use a ref to prevent double-calling confirm in strict mode
	const confirmedRef = useRef(false);

	useEffect(() => {
		if (
			sessionId &&
			sessionData?.status === "complete" &&
			sessionData?.payment_status === "paid" &&
			!confirmedRef.current &&
			!isSuccess &&
			!isError &&
			!isConfirming
		) {
			confirmedRef.current = true;
			confirmRecharge(sessionId);
		}
	}, [sessionId, sessionData, confirmRecharge, isSuccess, isError, isConfirming]);

	// Still loading session status
	if (isStatusLoading || isConfirming) {
		return (
			<div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center space-y-6">
				<Loader2 className="animate-spin text-blue-600" size={48} />
				<div className="space-y-2">
					<h1 className="text-2xl font-black text-gray-900">Verifying Payment...</h1>
					<p className="text-gray-500 font-medium">
						Please wait while we confirm your wallet recharge.
					</p>
				</div>
			</div>
		);
	}

	// Session expired or payment not completed
	if (sessionData && (sessionData.status === "expired" || sessionData.payment_status !== "paid")) {
		return (
			<div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center space-y-6">
				<div className="bg-red-50 p-6 rounded-full text-red-600">
					<XCircle size={64} />
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-black text-gray-900">Payment Failed</h1>
					<p className="text-gray-500 font-medium">
						The payment session has expired or was not completed. No money was deducted.
					</p>
				</div>
				<button
					onClick={() => router.push("/profile")}
					className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-800 p-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-gray-900 active:scale-95"
				>
					Back to Profile <ArrowRight size={20} />
				</button>
			</div>
		);
	}

	// Confirmation error
	if (isError) {
		return (
			<div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center space-y-6">
				<div className="bg-yellow-50 p-6 rounded-full text-yellow-600">
					<XCircle size={64} />
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-black text-gray-900">Verification Issue</h1>
					<p className="text-gray-500 font-medium">
						Your payment was received but we could not update your wallet right now. Don&apos;t
						worry — it will be reflected shortly.
					</p>
				</div>
				<button
					onClick={() => router.push("/profile")}
					className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 p-5 text-lg font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
				>
					Back to Profile <ArrowRight size={20} />
				</button>
			</div>
		);
	}

	// Success
	return (
		<div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center space-y-6">
			<div className="bg-green-50 p-6 rounded-full text-green-600 animate-in zoom-in duration-500">
				<CheckCircle2 size={64} />
			</div>

			<div className="space-y-2">
				<h1 className="text-3xl font-black text-gray-900">Top-up Successful!</h1>
				<p className="text-gray-500 font-medium">
					Your wallet balance has been updated. You can now use it to pay for your bookings.
				</p>
			</div>

			<button
				onClick={() => router.push("/profile")}
				className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 p-5 text-lg font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
			>
				Back to Profile <ArrowRight size={20} />
			</button>
		</div>
	);
}

export default function WalletTopUpSuccessPage() {
	return (
		<Suspense
			fallback={
				<div className="p-12 text-center text-gray-400 animate-pulse">Verifying transaction...</div>
			}
		>
			<SuccessContent />
		</Suspense>
	);
}
