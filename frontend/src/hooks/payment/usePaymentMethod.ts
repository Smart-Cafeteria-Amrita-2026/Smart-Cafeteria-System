import { useState } from "react";
import { PaymentMethod } from "@/types/payment/payment.types";

/**
 * UI hook to manage payment method selection
 * (Card / UPI / Net Banking / Cash)
 */
export function usePaymentMethod() {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

	const isCard = paymentMethod === "CARD";
	const isUpi = paymentMethod === "UPI";
	const isNetBanking = paymentMethod === "NET_BANKING";
	const isCash = paymentMethod === "CASH";

	const resetPaymentMethod = () => {
		setPaymentMethod(null);
	};

	return {
		paymentMethod,
		setPaymentMethod,
		resetPaymentMethod,
		isCard,
		isUpi,
		isNetBanking,
		isCash,
	};
}
