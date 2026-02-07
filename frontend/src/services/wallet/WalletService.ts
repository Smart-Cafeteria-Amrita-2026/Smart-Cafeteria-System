import { apiGet, apiPost } from "@/lib/api";
import type {
	WalletBalanceResponse,
	WalletTransactionsResponse,
	CreateCheckoutSessionResponse,
	CheckoutSessionStatusResponse,
	ConfirmRechargeResponse,
} from "../../types/wallet/wallet.types";

export const WalletService = {
	/** Get the authenticated user's personal wallet balance */
	getWalletBalance: (): Promise<WalletBalanceResponse> =>
		apiGet<WalletBalanceResponse>("/api/payments/personal-wallet/balance"),

	/** Get wallet transaction history */
	getWalletTransactions: (limit = 20, offset = 0): Promise<WalletTransactionsResponse> =>
		apiGet<WalletTransactionsResponse>(
			`/api/payments/personal-wallet/transactions?limit=${limit}&offset=${offset}`
		),

	/** Create a Stripe Checkout Session (embedded mode) for wallet recharge */
	createCheckoutSession: (payload: {
		amount: number;
		return_url: string;
	}): Promise<CreateCheckoutSessionResponse> =>
		apiPost<CreateCheckoutSessionResponse>("/api/payments/personal-wallet/create-session", payload),

	/** Poll / get the status of a Stripe Checkout Session */
	getSessionStatus: (sessionId: string): Promise<CheckoutSessionStatusResponse> =>
		apiGet<CheckoutSessionStatusResponse>(
			`/api/payments/personal-wallet/session-status/${sessionId}`
		),

	/** Confirm wallet recharge after Stripe payment completes */
	confirmRecharge: (sessionId: string): Promise<ConfirmRechargeResponse> =>
		apiPost<ConfirmRechargeResponse>("/api/payments/personal-wallet/confirm-recharge", {
			session_id: sessionId,
		}),

	/** Contribute from personal wallet to a booking wallet */
	contributeToBooking: (bookingId: string, amount: number): Promise<{ success: boolean }> =>
		apiPost<{ success: boolean }>("/api/payments/wallet/contribute", {
			booking_id: Number(bookingId),
			amount,
		}),
};
