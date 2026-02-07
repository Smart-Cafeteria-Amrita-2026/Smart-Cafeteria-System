import { SlotData } from "@/src/types/booking.types";
import { Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface Props {
	slot: SlotData;
	isSelected: boolean;
	isDisabled: boolean;
	onSelect: (id: string) => void;
}

// Format time from "HH:MM:SS" to "HH:MM AM/PM"
function formatTime(time: string): string {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "PM" : "AM";
	const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
	return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Get color based on occupancy percentage
function getOccupancyColor(percentage: number): string {
	if (percentage >= 80) return "text-red-600 bg-red-50";
	if (percentage >= 50) return "text-yellow-600 bg-yellow-50";
	return "text-green-600 bg-green-50";
}

export function SlotCard({ slot, isSelected, isDisabled, onSelect }: Props) {
	const slotId = slot.slot_id.toString();
	const occupancyColor = getOccupancyColor(slot.occupancy_percentage);

	return (
		<button
			onClick={() => !isDisabled && onSelect(slotId)}
			disabled={isDisabled || slot.is_full}
			className={`relative flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all
                ${
									isSelected
										? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
										: "border-gray-100 bg-white hover:border-blue-200"
								}
                ${isDisabled || slot.is_full ? "opacity-40 cursor-not-allowed bg-gray-50" : "cursor-pointer"}
            `}
		>
			{/* Time Row */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Clock size={16} className={isSelected ? "text-blue-500" : "text-gray-400"} />
					<span className={`text-lg font-bold ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
						{formatTime(slot.start_time)} - {formatTime(slot.end_time)}
					</span>
				</div>
				{isSelected && <CheckCircle2 className="text-blue-600" size={20} />}
			</div>

			{/* Occupancy Info Row */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Users size={14} className={isSelected ? "text-blue-500" : "text-gray-400"} />
					<span className={`font-semibold ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
						{slot.remaining_capacity} seats left
					</span>
					<span className="text-xs text-gray-400">out of {slot.max_capacity}</span>
				</div>
				<span className={`text-xs font-bold px-2 py-1 rounded-full ${occupancyColor}`}>
					{slot.occupancy_percentage}% filled
				</span>
			</div>

			{/* Warning Messages */}
			{isDisabled && !slot.is_full && (
				<div className="flex items-center gap-1 text-red-500">
					<AlertCircle size={12} />
					<p className="text-[10px] font-bold uppercase tracking-tight">
						Not enough seats for {slot.remaining_capacity < 1 ? "booking" : "your group"}
					</p>
				</div>
			)}
			{slot.is_full && (
				<div className="flex items-center gap-1 text-gray-500">
					<AlertCircle size={12} />
					<p className="text-[10px] font-bold uppercase tracking-tight">Fully Booked</p>
				</div>
			)}
		</button>
	);
}
