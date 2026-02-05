'use client';

import { useRouter } from 'next/navigation';

/* ======================================================
   Payment Success Page
====================================================== */

export default function PaymentSuccessPage() {
    const router = useRouter();

    // Mocked values (later comes from backend)
    const orderId = `ORD-${Date.now()}`;
    const tokenNumber = `TKN-${Math.floor(100 + Math.random() * 900)}`;
    const counterNumber = Math.floor(1 + Math.random() * 3);
    const queuePosition = Math.floor(1 + Math.random() * 10);

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
            {/* Success Icon */}
            <div className="mb-4 text-5xl">✅</div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-green-700">
                Order Confirmed
            </h1>

            <p className="mt-2 text-sm text-gray-600">
                Your payment was successful. Please use the token below to
                collect your food.
            </p>

            {/* Token Card */}
            <div className="mt-6 w-full rounded-xl border border-green-300 bg-green-50 p-4">
                <div className="mb-2 text-sm text-gray-700">
                    Order ID
                </div>
                <div className="mb-4 font-mono text-lg font-semibold">
                    {orderId}
                </div>

                <div className="mb-2 text-sm text-gray-700">
                    Your Token Number
                </div>
                <div className="text-3xl font-bold text-green-800">
                    {tokenNumber}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Counter</p>
                        <p className="font-semibold">{counterNumber}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Queue Position</p>
                        <p className="font-semibold">{queuePosition}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex w-full flex-col gap-3">
                <button
                    onClick={() => router.push('/bookings')}
                    className="rounded-lg bg-blue-600 py-3 font-medium text-white"
                >
                    View My Bookings
                </button>

                <button
                    onClick={() => router.push('/')}
                    className="rounded-lg border border-gray-300 py-3 font-medium text-gray-700"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
