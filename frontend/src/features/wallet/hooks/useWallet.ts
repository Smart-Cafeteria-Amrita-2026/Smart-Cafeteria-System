import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WalletService } from '../services/WalletService';
import { toast } from 'react-hot-toast';

export function useWallet() {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: WalletService.getWallet,
        staleTime: 2 * 60 * 1000,
    });
}

export function useTopUp() {
    return useMutation({
        mutationFn: (amount: number) => WalletService.initiateTopUp(amount),
        onError: () => {
            toast.error('Failed to initiate top-up.');
        }
    });
}

export function useContribute() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ bookingId, amount }: { bookingId: string, amount: number }) =>
            WalletService.contributeToBooking(bookingId, amount),
        onSuccess: () => {
            toast.success('Contribution successful!');
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Contribution failed.');
        }
    });
}
