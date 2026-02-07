export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Transaction {
	id: string;
	amount: number;
	status: TransactionStatus;
	date: string;
	orderId: string;
	paymentMethod: string;
}
