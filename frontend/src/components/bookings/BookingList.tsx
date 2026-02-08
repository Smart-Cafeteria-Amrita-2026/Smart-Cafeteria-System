import { useBookings } from "@/src/hooks/useSlots";
import { useWallet } from "@/src/hooks/wallet/useWallet";
import { BookingCard } from "./BookingCard";
import { BookingCardSkeleton } from "./BookingCardSkeleton";

export function BookingList() {
	const { data: bookings, isLoading, error } = useBookings();
	const { data: wallet, isLoading: isWalletLoading } = useWallet();

	if (isLoading || isWalletLoading) {
		return (
			<div className="bg-white rounded-xl shadow divide-y">
				{Array.from({ length: 3 }).map((_, i) => (
					<BookingCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (error || !bookings) {
		return (
			<div className="p-4 text-center text-red-500 bg-white rounded-xl shadow">
				Failed to load bookings.
			</div>
		);
	}

	if (bookings.length === 0) {
		return (
			<div className="p-4 text-center text-gray-500 bg-white rounded-xl shadow">
				No bookings yet.
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow divide-y overflow-hidden font-sans">
			{bookings.map((booking) => (
				<BookingCard
					key={booking.id}
					booking={booking}
					walletBalance={wallet?.wallet_balance || 0}
				/>
			))}
		</div>
	);
}
