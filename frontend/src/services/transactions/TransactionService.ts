import { apiGet } from "@/lib/api";
import { Transaction } from "../../types/transactions/transaction.types";
import { API_ROUTES } from "@/lib/routes";
import type {
	BookingPaymentsResponse,
	WalletTransactionsApiResponse,
} from "../../types/transactions/transactionHistory.types";

export const TransactionService = {
	getTransactions: (): Promise<Transaction[]> => apiGet("/transactions"),

	/** Get booking payments for authenticated user */
	getBookingPayments: (): Promise<BookingPaymentsResponse> =>
		apiGet<BookingPaymentsResponse>(API_ROUTES.BOOKINGS.PAYMENTS),

	/** Get wallet recharge transactions for authenticated user */
	getWalletTransactions: (limit = 20, offset = 0): Promise<WalletTransactionsApiResponse> =>
		apiGet<WalletTransactionsApiResponse>(
			`${API_ROUTES.WALLET.TRANSACTIONS}?limit=${limit}&offset=${offset}`
		),
};
