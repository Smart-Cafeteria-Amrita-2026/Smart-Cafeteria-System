import { useTransactions } from "@/hooks/transactions/useTransactions";
import { TransactionCard } from "./TransactionCard";
import { TransactionCardSkeleton } from "./TransactionCardSkeleton";

export function TransactionList() {
	const { data: transactions, isLoading, error } = useTransactions();

	if (isLoading) {
		return (
			<div className="bg-white rounded-xl shadow divide-y">
				{Array.from({ length: 5 }).map((_, i) => (
					<TransactionCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (error || !transactions) {
		return (
			<div className="p-4 text-center text-red-500 bg-white rounded-xl shadow">
				Failed to load transactions.
			</div>
		);
	}

	if (transactions.length === 0) {
		return (
			<div className="p-4 text-center text-gray-500 bg-white rounded-xl shadow">
				No transactions yet.
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow divide-y overflow-hidden">
			{transactions.map((transaction) => (
				<TransactionCard key={transaction.id} transaction={transaction} />
			))}
		</div>
	);
}
