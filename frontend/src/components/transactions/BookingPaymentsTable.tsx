"use client";

import { useBookingPayments } from "@/hooks/transactions/useTransactionHistory";
import { CreditCard } from "lucide-react";

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

function BookingPaymentsTableSkeleton() {
	return (
		<div className="animate-pulse space-y-3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="h-10 bg-gray-100 rounded" />
			))}
		</div>
	);
}

export function BookingPaymentsTable() {
	const { data: payments, isLoading, error } = useBookingPayments();

	return (
		<section className="bg-white rounded-xl shadow overflow-hidden">
			{/* Section Header */}
			<div className="flex items-center gap-3 px-4 py-4 sm:px-6 border-b bg-gray-50">
				<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
					<CreditCard size={20} />
				</div>
				<h2 className="text-lg font-semibold text-gray-900">Booking Payments</h2>
			</div>

			<div className="p-4 sm:p-6">
				{isLoading && <BookingPaymentsTableSkeleton />}

				{error && <p className="text-center text-red-500 py-4">Failed to load booking payments.</p>}

				{!isLoading && !error && (!payments || payments.length === 0) && (
					<p className="text-center text-gray-500 py-4">No booking payments found.</p>
				)}

				{!isLoading && payments && payments.length > 0 && (
					<div className="overflow-x-auto -mx-4 sm:-mx-6">
						<table className="min-w-full divide-y divide-gray-200 text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Sl No
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Booking Reference
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Amount
									</th>
									<th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
										Date
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-100">
								{payments.map((payment, idx) => (
									<tr key={payment.id} className="hover:bg-gray-50 transition-colors">
										<td className="px-4 py-3 text-gray-600 whitespace-nowrap">{idx + 1}</td>
										<td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
											{payment.booking_reference}
										</td>
										<td className="px-4 py-3 text-gray-900 whitespace-nowrap">
											₹{Number(payment.amount).toFixed(2)}
										</td>
										<td className="px-4 py-3 text-gray-500 whitespace-nowrap">
											{formatDate(payment.created_at)}
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
