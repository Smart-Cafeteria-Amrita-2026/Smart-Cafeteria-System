"use client";

import { useWalletRechargeTransactions } from "@/hooks/transactions/useTransactionHistory";
import { Wallet } from "lucide-react";

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

function RechargeTableSkeleton() {
	return (
		<div className="animate-pulse space-y-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="h-10 bg-gray-100 rounded" />
			))}
		</div>
	);
}

export function WalletRechargeTable() {
	const { data, isLoading, error } = useWalletRechargeTransactions();

	const transactions = data?.transactions;

	return (
		<section className="bg-white rounded-xl shadow overflow-hidden">
			{/* Section Header */}
			<div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b bg-gray-50">
				<div className="p-2 bg-green-50 text-green-600 rounded-lg">
					<Wallet size={20} />
				</div>
				<h2 className="text-lg font-semibold text-gray-900">Wallet Recharge Transactions</h2>
			</div>

			<div className="p-4 sm:p-6">
				{isLoading && <RechargeTableSkeleton />}

				{error && (
					<p className="text-center text-red-500 py-4">Failed to load wallet transactions.</p>
				)}

				{!isLoading && !error && (!transactions || transactions.length === 0) && (
					<p className="text-center text-gray-500 py-4">No wallet transactions found.</p>
				)}

				{!isLoading && transactions && transactions.length > 0 && (
					<div className="overflow-x-auto -mx-4 sm:-mx-6">
						<table className="min-w-full divide-y divide-gray-200 text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Sl No
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Amount
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Description
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Date
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-100">
								{transactions.map((tx, idx) => (
									<tr key={tx.id} className="hover:bg-gray-50 transition-colors">
										<td className="px-4 py-3 text-gray-600 whitespace-nowrap">{idx + 1}</td>

										<td className="px-4 py-3 text-gray-900 whitespace-nowrap">
											₹{Number(tx.amount).toFixed(2)}
										</td>
										<td className="px-4 py-3 text-gray-600 max-w-50 truncate">
											{tx.description ?? "—"}
										</td>
										<td className="px-4 py-3 text-gray-500 whitespace-nowrap">
											{formatDate(tx.created_at)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</section>
	);
}
