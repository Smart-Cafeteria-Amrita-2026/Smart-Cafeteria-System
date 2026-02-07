export interface Transaction {
	id: string;
	type: "TOPUP" | "PAYMENT" | "REFUND";
	amount: number;
	status: "SUCCESS" | "PENDING" | "FAILED";
	createdAt: string;
	description: string;
}

export interface WalletTransaction {
	id: string;
	user_id: string;
	amount: number;
	transaction_type: "recharge" | "contribution" | "refund";
	session_id: string | null;
	description: string;
	created_at: string;
}

export interface Wallet {
	balance: number;
	currency: string;
	transactions: Transaction[];
}

export interface TopUpResponse {
	clientSecret: string;
	transactionId: string;
}

// Backend response shapes
export interface CreateCheckoutSessionResponse {
	success: boolean;
	message: string;
	data: {
		client_secret: string;
		session_id: string;
	};
}

export interface CheckoutSessionStatusResponse {
	success: boolean;
	message: string;
	data: {
		session_id: string;
		status: "open" | "complete" | "expired";
		payment_status: "paid" | "unpaid" | "no_payment_required";
		amount_total: number;
		customer_email: string | null;
	};
}

export interface ConfirmRechargeResponse {
	success: boolean;
	message: string;
	data: {
		user_id: string;
		amount_recharged: number;
		new_balance: number;
		transaction_id: string;
	};
}

export interface WalletBalanceResponse {
	success: boolean;
	message: string;
	data: {
		wallet_balance: number;
	};
}

export interface WalletTransactionsResponse {
	success: boolean;
	message: string;
	data: {
		transactions: WalletTransaction[];
		total_count: number;
	};
}
