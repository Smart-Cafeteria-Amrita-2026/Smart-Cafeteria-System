import React from 'react';
import { Wallet as WalletIcon, Plus, History } from 'lucide-react';
import { Transaction } from '../types/wallet.types';

interface Props {
    balance: number;
    currency: string;
    onTopUp: (amount: number) => void;
    isTopUpPending?: boolean;
}

export function WalletDisplay({ balance, currency, onTopUp, isTopUpPending }: Props) {
    const [topUpAmount, setTopUpAmount] = React.useState<number>(100);

    return (
        <div className="space-y-6 p-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Available Balance</span>
                    <WalletIcon size={24} className="opacity-80" />
                </div>
                <div className="text-4xl font-black">
                    {currency === 'INR' ? '₹' : currency}{balance.toFixed(2)}
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                    <Plus size={20} className="text-blue-600" />
                    <span className="font-bold text-gray-800">Add Money to Wallet</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map(amt => (
                        <button
                            key={amt}
                            onClick={() => setTopUpAmount(amt)}
                            className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${topUpAmount === amt
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-100 hover:border-blue-100'
                                }`}
                        >
                            ₹{amt}
                        </button>
                    ))}
                </div>

                <button
                    disabled={isTopUpPending}
                    onClick={() => onTopUp(topUpAmount)}
                    className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-xl font-black text-sm uppercase tracking-tight hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    {isTopUpPending ? 'Processing...' : `Top up ₹${topUpAmount}`}
                </button>
            </div>
        </div>
    );
}

export function WalletTransactions({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="divide-y">
            {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 italic text-sm">No transactions yet.</div>
            ) : (
                transactions.map((tr) => (
                    <div key={tr.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tr.type === 'TOPUP' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                <History size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{tr.description}</p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    {new Date(tr.createdAt).toLocaleDateString()} • {tr.type}
                                </p>
                            </div>
                        </div>
                        <div className={`text-sm font-black ${tr.type === 'TOPUP' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {tr.type === 'TOPUP' ? '+' : '-'}₹{tr.amount}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
