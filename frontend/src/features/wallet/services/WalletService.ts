import { apiGet, apiPost } from '@/lib/api';
import { Wallet, TopUpResponse } from '../types/wallet.types';

export const WalletService = {
    getWallet: async (): Promise<Wallet> => {
        try {
            return await apiGet<Wallet>('/wallet');
        } catch (error) {
            console.warn('Backend not detected, using mock wallet.');
            return {
                balance: 150.00,
                currency: 'INR',
                transactions: [
                    {
                        id: 't1',
                        type: 'TOPUP',
                        amount: 200,
                        status: 'SUCCESS',
                        createdAt: new Date().toISOString(),
                        description: 'Fund top-up via Card'
                    },
                    {
                        id: 't2',
                        type: 'PAYMENT',
                        amount: 50,
                        status: 'SUCCESS',
                        createdAt: new Date().toISOString(),
                        description: 'Payment for Booking #ORD-123'
                    }
                ]
            };
        }
    },

    initiateTopUp: (amount: number): Promise<TopUpResponse> =>
        apiPost<TopUpResponse>('/wallet/topup', { amount }),

    contributeToBooking: (bookingId: string, amount: number): Promise<{ success: boolean }> =>
        apiPost<{ success: boolean }>('/bookings/contribute', { bookingId, amount }),
};
