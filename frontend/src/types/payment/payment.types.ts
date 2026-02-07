/* ===============================
   Payment Enums
================================ */

export type PaymentMode = "PAY_NOW" | "PAY_LATER" | "GROUP_SPLIT";

export type PaymentMethod = "CARD" | "UPI" | "NET_BANKING" | "CASH";

/* ===============================
   Bill / Order Types
================================ */

export interface BillItem {
	itemId: string;
	name: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

export interface BillSummary {
	items: BillItem[];
	totalAmount: number;
}

/* ===============================
   Transaction Payloads
================================ */

export interface CreateTransactionPayload {
	orderId: string;
	paymentMode: PaymentMode;
	paymentMethod: PaymentMethod;
	amount: number;

	// Optional metadata (depends on method)
	metadata?: {
		cardLast4?: string;
		upiId?: string;
		bankName?: string;
		groupMembers?: string[];
	};
}

/* ===============================
   Transaction Response
================================ */

export interface TransactionResponse {
	transactionId: string;
	orderId: string;
	paymentMode: PaymentMode;
	paymentMethod: PaymentMethod;
	amount: number;
	status: "SUCCESS" | "PENDING" | "FAILED";
	createdAt: string;
}

/* ===============================
   Group Split (UI Helper)
================================ */

export interface GroupSplitMember {
	registerNumber: string;
	amount: number;
	status: "PAID" | "PENDING";
}
