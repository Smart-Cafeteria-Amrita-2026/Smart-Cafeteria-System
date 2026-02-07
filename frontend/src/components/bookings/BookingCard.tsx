import { CreditCard, Wallet, AlertCircle } from "lucide-react";
import { Booking, BookingStatus } from "@/src/types/booking.types";
import { useContribute } from "@/src/hooks/wallet/useWallet";
import { toast } from "react-hot-toast";

interface Props {
	booking: Booking;
	walletBalance: number;
}

export function BookingCard({ booking, walletBalance }: Props) {
	const { mutate: contribute, isPending } = useContribute();

	const handleContribute = () => {
		if (walletBalance < booking.totalAmount) {
			toast.error(
				`Insufficient balance! You need ₹${(booking.totalAmount - walletBalance).toFixed(2)} more.`
			);
			return;
		}

		contribute({ bookingId: booking.id, amount: booking.totalAmount });
	};

	const statusColor: Record<BookingStatus, string> = {
		CONFIRMED: "text-blue-600 bg-blue-50",
		COMPLETED: "text-green-600 bg-green-50",
		CANCELLED: "text-red-600 bg-red-50",
		PENDING: "text-yellow-700 bg-yellow-50 border border-yellow-100",
	};

	return (
		<div className="flex flex-col gap-4 border-b p-5 last:border-0 hover:bg-gray-50/50 transition-all rounded-xl mt-2 font-sans">
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<p className="text-sm font-bold text-gray-900">
						{new Date(booking.date).toLocaleDateString(undefined, {
							weekday: "short",
							day: "numeric",
							month: "short",
						})}{" "}
						• {booking.slot}
					</p>
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<span className="font-medium text-gray-700">₹{booking.totalAmount.toFixed(2)}</span>
						<span>•</span>
						<span>{booking.items.length} items</span>
					</div>
				</div>
				<div
					className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor[booking.status]}`}
				>
					{booking.status}
				</div>
			</div>

			<div className="flex flex-wrap gap-1.5 grayscale opacity-70">
				{booking.items.slice(0, 3).map((item) => (
					<span
						key={item.id}
						className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 border"
					>
						{item.name} (x{item.quantity})
					</span>
				))}
			</div>

			{booking.status === "PENDING" && (
				<div className="space-y-3 mt-1">
					<div className="flex items-center justify-between text-[11px] font-bold">
						<span className="text-gray-400">YOUR WALLET BALANCE</span>
						<span
							className={`${walletBalance < booking.totalAmount ? "text-red-500" : "text-green-600"} flex items-center gap-1`}
						>
							₹{walletBalance.toFixed(2)}
							{walletBalance < booking.totalAmount && <AlertCircle size={12} />}
						</span>
					</div>

					<button
						onClick={handleContribute}
						disabled={isPending}
						className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl font-bold uppercase tracking-tight transition-all active:scale-[0.98] shadow-md ${
							walletBalance < booking.totalAmount
								? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
								: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
						}`}
					>
						<Wallet size={16} />
						{isPending ? "Processing..." : "Contribute from Wallet"}
					</button>

					{walletBalance < booking.totalAmount && (
						<p className="text-[10px] text-center text-red-400 font-medium">
							Please top up your wallet to pay for this booking.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
