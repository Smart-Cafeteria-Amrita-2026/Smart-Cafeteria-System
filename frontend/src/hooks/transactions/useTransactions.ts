import { useQuery } from "@tanstack/react-query";
import { TransactionService } from "../../services/transactions/TransactionService";
import { Transaction } from "../../types/transactions/transaction.types";

export function useTransactions() {
	return useQuery<Transaction[]>({
		queryKey: ["transactions"],
		queryFn: TransactionService.getTransactions,
		staleTime: 5 * 60 * 1000,
	});
}
