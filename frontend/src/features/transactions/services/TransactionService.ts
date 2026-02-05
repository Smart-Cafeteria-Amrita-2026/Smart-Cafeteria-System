import { apiGet } from '@/lib/api';
import { Transaction } from '../types/transaction.types';

export const TransactionService = {
    getTransactions: (): Promise<Transaction[]> => apiGet('/transactions'),
};
