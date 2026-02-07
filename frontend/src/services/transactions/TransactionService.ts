import { apiGet } from "@/lib/api";
import { Transaction } from "../../types/transactions/transaction.types";

export const TransactionService = {
	getTransactions: (): Promise<Transaction[]> => apiGet("/transactions"),
};
