'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { ProfileHeaderSkeleton } from '@/features/profile/components/ProfileHeaderSkeleton';
import { BookingList } from '@/features/bookings/components/BookingList';
import { WalletDashboard } from '@/features/wallet/components/WalletDashboard';
import { WalletTransactions } from '@/features/wallet/components/WalletDisplay';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { ChevronDown, ChevronUp, History, BookCheck, ArrowLeft, Wallet } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { token, isHydrated, logout } = useAuthStore();
    const { data: profile, isLoading, error } = useProfile();

    // Redirect guest users
    useEffect(() => {
        if (isHydrated && !token) {
            router.push('/login?redirect=/profile');
        }
    }, [isHydrated, token, router]);

    // UI State for sections
    const [isWalletOpen, setIsWalletOpen] = useState(true);
    const [isBookingsOpen, setIsBookingsOpen] = useState(false);
    const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

    const { data: wallet } = useWallet();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (error) {
        return (
            <div className="mx-auto max-w-2xl p-4 text-center space-y-4 pt-20">
                <p className="text-red-500 font-medium">Failed to load profile. Please try again.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>

            {/* Profile Info */}
            {isLoading ? (
                <ProfileHeaderSkeleton />
            ) : profile ? (
                <ProfileHeader
                    name={profile.name}
                    email={profile.email}
                />
            ) : null}

            {/* Sections */}
            <div className="space-y-4">
                {/* Wallet Section */}
                <section id="wallet" className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <button
                        onClick={() => setIsWalletOpen(!isWalletOpen)}
                        className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Wallet size={20} />
                            </div>
                            <span className="font-semibold text-gray-900">Personal Wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 italic">₹{wallet?.balance.toFixed(2) || '0.00'}</span>
                            {isWalletOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>
                    {isWalletOpen && (
                        <div className="border-t">
                            <WalletDashboard />
                        </div>
                    )}
                </section>

                {/* Bookings Section */}
                <section id="bookings" className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <button
                        onClick={() => setIsBookingsOpen(!isBookingsOpen)}
                        className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <BookCheck size={20} />
                            </div>
                            <span className="font-semibold text-gray-900">My Bookings</span>
                        </div>
                        {isBookingsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {isBookingsOpen && (
                        <div className="border-t">
                            <BookingList />
                        </div>
                    )}
                </section>

                {/* Transactions Section */}
                <section id="transactions" className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <button
                        onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
                        className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <History size={20} />
                            </div>
                            <span className="font-semibold text-gray-900">Transactions History</span>
                        </div>
                        {isTransactionsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {isTransactionsOpen && (
                        <div className="border-t">
                            {wallet?.transactions && <WalletTransactions transactions={wallet.transactions} />}
                        </div>
                    )}
                </section>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full mt-8 rounded-xl bg-red-50 p-4 text-center font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
                Log Out
            </button>
        </div>
    );
}
