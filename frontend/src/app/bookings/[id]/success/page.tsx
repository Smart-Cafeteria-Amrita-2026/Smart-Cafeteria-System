"use client";

import { useParams, useRouter } from "next/navigation";
import { useBookings } from "@/hooks/useSlots";
import { BookingSuccessContent } from "@/components/bookings/BookingSuccessContent";
import { ArrowLeft, Home, Loader2 } from "lucide-react";

export default function BookingSuccessPage() {
	const { id } = useParams();
	const router = useRouter();
	const { data: bookings, isLoading, isError } = useBookings();
	const booking = bookings?.find((b) => b.id === id);

	if (isLoading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-4">
				<Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
				<p className="text-gray-500 font-medium">Fetching booking confirmation...</p>
			</div>
		);
	}

	if (isError || !booking) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-8 text-center space-y-4">
				<div className="bg-red-50 text-red-600 p-6 rounded-3xl font-medium">
					We couldn't retrieve your booking details, but don't worry—your payment was successful.
					Check your profile for details.
				</div>
				<button
					onClick={() => router.push("/profile?tab=bookings")}
					className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold"
				>
					Go to Bookings
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-xl p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
			<BookingSuccessContent booking={booking} />

			<div className="grid grid-cols-2 gap-3">
				<button
					onClick={() => router.push("/")}
					className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-4 font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
				>
					<Home size={18} /> Home
				</button>
				<button
					onClick={() => router.push("/profile?tab=bookings")}
					className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 p-4 font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
				>
					View History
				</button>
			</div>
		</div>
	);
}
