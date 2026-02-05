'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function TopUpCheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientSecret = searchParams.get('secret');

    const options = useMemo(() => ({ clientSecret: clientSecret || '' }), [clientSecret]);

    if (!clientSecret) {
        return <div className="p-8 text-center text-red-500">Invalid session. Please try again.</div>;
    }

    return (
        <div className="mx-auto max-w-2xl p-4 md:p-8 space-y-6">
            <header className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Funds</h1>
                    <p className="text-gray-500 text-sm">Securely add money to your personal wallet</p>
                </div>
            </header>

            <div className="rounded-3xl bg-white min-h-[600px] overflow-hidden shadow-xl shadow-blue-50/50">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    );
}

export default function WalletTopUpPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400 animate-pulse">Initializing Stripe...</div>}>
            <TopUpCheckoutContent />
        </Suspense>
    );
}
