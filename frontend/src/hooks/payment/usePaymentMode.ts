import { useState } from "react";
import { PaymentMode } from "@/types/payment/payment.types";

/**
 * UI hook to manage payment mode selection
 * (Pay Now / Pay Later / Group Split)
 */
export function usePaymentMode() {
	const [paymentMode, setPaymentMode] = useState<PaymentMode>("PAY_NOW");

	const isPayNow = paymentMode === "PAY_NOW";
	const isPayLater = paymentMode === "PAY_LATER";
	const isGroupSplit = paymentMode === "GROUP_SPLIT";

	return {
		paymentMode,
		setPaymentMode,
		isPayNow,
		isPayLater,
		isGroupSplit,
	};
}
