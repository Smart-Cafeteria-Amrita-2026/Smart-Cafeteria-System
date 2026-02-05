export interface Transaction {
    id: string;
    type: 'TOPUP' | 'PAYMENT' | 'REFUND';
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    createdAt: string;
    description: string;
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
