import { Booking } from "@/types/booking.types";
import { CheckCircle2, Calendar, Clock, Users, Utensils } from "lucide-react";

interface Props {
	booking: Booking;
}

export function BookingSuccessContent({ booking }: Props) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center text-center space-y-2 py-4">
				<CheckCircle2 className="text-green-500" size={64} />
				<h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
				<p className="text-gray-500">Your meal booking is confirmed and ready.</p>
			</div>

			<div className="rounded-3xl border bg-white p-6 shadow-sm space-y-4">
				<div className="flex items-center justify-between border-b pb-4">
					<div className="flex items-center gap-3">
						<div className="bg-blue-50 p-2 rounded-xl text-blue-600">
							<Utensils size={20} />
						</div>
						<div>
							<p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Category</p>
							<p className="font-bold text-gray-900 capitalize">{booking.mealType}</p>
						</div>
					</div>
					<div className="text-right">
						<p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Members</p>
						<div className="flex items-center gap-1 justify-end font-bold text-gray-900">
							<Users size={16} /> {booking.members}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 border-b pb-4">
					<div className="flex items-center gap-3">
						<div className="bg-gray-50 p-2 rounded-xl text-gray-400">
							<Calendar size={20} />
						</div>
						<div>
							<p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Date</p>
							<p className="font-bold text-gray-900">
								{new Date(booking.date).toLocaleDateString(undefined, {
									day: "numeric",
									month: "short",
								})}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="bg-gray-50 p-2 rounded-xl text-gray-400">
							<Clock size={20} />
						</div>
						<div>
							<p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Slot</p>
							<p className="font-bold text-gray-900">{booking.slot.split(" - ")[0]}</p>
						</div>
					</div>
				</div>

				<div className="space-y-3 pt-2">
					<p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Order Items</p>
					{booking.items.map((item) => (
						<div key={item.id} className="flex justify-between text-sm">
							<span className="text-gray-600">
								{item.name} × {item.quantity}
							</span>
							<span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
						</div>
					))}
					<div className="flex justify-between border-t pt-3 mt-2">
						<span className="font-bold text-gray-900">Total Amount</span>
						<span className="text-xl font-black text-blue-600">₹{booking.totalAmount}</span>
					</div>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
				<div className="flex-1">
					<p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
						Queue Info
					</p>
					<p className="text-sm text-blue-800 font-medium">
						Please proceed to **Counter 2** when your token appears on the screen.
					</p>
				</div>
				<div className="bg-white px-4 py-2 rounded-xl border border-blue-200 shadow-sm text-center">
					<p className="text-[10px] text-gray-400 font-bold uppercase">Token</p>
					<p className="text-xl font-black text-blue-600">#42</p>
				</div>
			</div>
		</div>
	);
}
