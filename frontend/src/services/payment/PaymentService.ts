import { apiPost, apiGet } from "@/lib/api";
import {
	CreateTransactionPayload,
	TransactionResponse,
	BillSummary,
} from "../../types/payment/payment.types";

export const PaymentService = {
	/**
	 * Fetch bill summary for the current order
	 * (can be computed backend-side later)
	 */
	getBillSummary: <T = BillSummary>(orderId: string): Promise<T> => {
		return apiGet<T>(`/payments/${orderId}/bill`);
	},

	/**
	 * Create a new payment transaction
	 */
	createTransaction: <T = TransactionResponse>(payload: CreateTransactionPayload): Promise<T> => {
		return apiPost<T>("/payments/transaction", payload);
	},

	/**
	 * Get transaction details (after creation)
	 */
	getTransactionById: <T = TransactionResponse>(transactionId: string): Promise<T> => {
		return apiGet<T>(`/payments/transaction/${transactionId}`);
	},
};
