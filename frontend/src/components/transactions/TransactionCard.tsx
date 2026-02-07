import { Transaction } from "@/types/transactions/transaction.types";

interface Props {
	transaction: Transaction;
}

export function TransactionCard({ transaction }: Props) {
	const statusColor = {
		SUCCESS: "text-green-600 bg-green-50",
		PENDING: "text-yellow-600 bg-yellow-50",
		FAILED: "text-red-600 bg-red-50",
	};

	return (
		<div className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-gray-50 transition-colors">
			<div className="space-y-1">
				<p className="font-medium text-gray-900">₹{transaction.amount.toFixed(2)}</p>
				<p className="text-xs text-gray-500">
					{new Date(transaction.date).toLocaleDateString()} • {transaction.paymentMethod}
				</p>
			</div>
			<div
				className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColor[transaction.status]}`}
			>
				{transaction.status}
			</div>
		</div>
	);
}
