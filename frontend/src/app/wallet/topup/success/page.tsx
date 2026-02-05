'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            toast.success('Funds added successfully!');
        }
    }, [sessionId]);

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center space-y-6">
            <div className="bg-green-50 p-6 rounded-full text-green-600 animate-in zoom-in duration-500">
                <CheckCircle2 size={64} />
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black text-gray-900">Top-up Successful!</h1>
                <p className="text-gray-500 font-medium">Your wallet balance has been updated. You can now use it to pay for your bookings.</p>
            </div>

            <button
                onClick={() => router.push('/profile')}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 p-5 text-lg font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
            >
                Back to Profile <ArrowRight size={20} />
            </button>
        </div>
    );
}

export default function WalletTopUpSuccessPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400">Verifying transaction...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
