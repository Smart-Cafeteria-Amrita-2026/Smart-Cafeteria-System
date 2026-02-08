"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { BookingPaymentsTable } from "@/components/transactions/BookingPaymentsTable";
import { WalletRechargeTable } from "@/components/transactions/WalletRechargeTable";
import { ArrowLeft, ReceiptText } from "lucide-react";

export default function TransactionHistoryPage() {
	const router = useRouter();
	const { token, isHydrated } = useAuthStore();

	// Redirect guest users
	useEffect(() => {
		if (isHydrated && !token) {
			router.push("/login?redirect=/transaction-history");
		}
	}, [isHydrated, token, router]);

	return (
		<div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-4 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4 mb-2">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={20} />
				</button>
				<div className="flex items-center gap-3">
					<div className="p-2 bg-green-50 text-green-600 rounded-lg">
						<ReceiptText size={22} />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
				</div>
			</div>

			{/* Booking Payments Section */}
			<BookingPaymentsTable />

			{/* Wallet Recharge Transactions Section */}
			<WalletRechargeTable />
		</div>
	);
}
