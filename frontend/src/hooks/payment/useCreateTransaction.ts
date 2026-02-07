import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { PaymentService } from "@/services/payment/PaymentService";
import { CreateTransactionPayload, TransactionResponse } from "@/types/payment/payment.types";

/**
 * Hook to create a payment transaction
 * Uses Service layer only (no direct API calls)
 */
export function useCreateTransaction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateTransactionPayload) =>
			PaymentService.createTransaction<TransactionResponse>(payload),

		onSuccess: (data) => {
			toast.success("Transaction created successfully");

			// Invalidate cart & related queries
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["billSummary"] });

			// Optional: could cache transaction if needed later
			queryClient.setQueryData(["transaction", data.transactionId], data);
		},

		onError: () => {
			toast.error("Transaction failed. Please try again.");
		},
	});
}
