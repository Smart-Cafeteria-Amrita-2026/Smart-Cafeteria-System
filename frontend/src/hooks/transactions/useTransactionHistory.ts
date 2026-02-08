import { useQuery } from "@tanstack/react-query";
import { TransactionService } from "../../services/transactions/TransactionService";

/** Fetch booking payments for the authenticated user */
export function useBookingPayments() {
	return useQuery({
		queryKey: ["transactions", "bookingPayments"],
		queryFn: TransactionService.getBookingPayments,
		staleTime: 30 * 1000,
		select: (res) => res.data,
	});
}

/** Fetch wallet recharge transactions for the authenticated user */
export function useWalletRechargeTransactions(limit = 20, offset = 0) {
	return useQuery({
		queryKey: ["transactions", "walletRecharge", limit, offset],
		queryFn: () => TransactionService.getWalletTransactions(limit, offset),
		staleTime: 30 * 1000,
		select: (res) => res.data,
	});
}
