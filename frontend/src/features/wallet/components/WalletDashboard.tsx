'use client';

import { useWallet, useTopUp } from '../hooks/useWallet';
import { WalletDisplay } from './WalletDisplay';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WalletDashboard() {
    const router = useRouter();
    const { data: wallet, isLoading } = useWallet();
    const { mutate: topUp, isPending: isTopUpPending } = useTopUp();

    const handleTopUp = (amount: number) => {
        topUp(amount, {
            onSuccess: (data) => {
                // Redirect to a dedicated top-up payment page
                router.push(`/wallet/topup/${data.transactionId}?secret=${data.clientSecret}`);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                <p className="text-gray-500 font-medium">Syncing your wallet...</p>
            </div>
        );
    }

    if (!wallet) return null;

    return (
        <WalletDisplay
            balance={wallet.balance}
            currency={wallet.currency}
            onTopUp={handleTopUp}
            isTopUpPending={isTopUpPending}
        />
    );
}
