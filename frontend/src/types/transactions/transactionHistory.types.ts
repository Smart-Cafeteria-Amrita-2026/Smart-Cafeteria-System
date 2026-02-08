// Booking payment record from /api/bookings/payments
export interface BookingPayment {
	id: string;
	booking_id: number;
	booking_reference: string;
	user_id: string;
	amount: number;
	created_at: string;
}

export interface BookingPaymentsResponse {
	success: boolean;
	message: string;
	data: BookingPayment[];
}

// Wallet recharge transaction from /api/payments/personal-wallet/transactions
export interface WalletRechargeTransaction {
	id: string;
	user_id: string;
	amount: number;
	transaction_type: string;
	session_id: string | null;
	description: string;
	created_at: string;
}

export interface WalletTransactionsApiResponse {
	success: boolean;
	message: string;
	data: {
		transactions: WalletRechargeTransaction[];
		total_count: number;
	};
}
