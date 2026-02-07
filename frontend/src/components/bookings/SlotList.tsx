"use client";

import { useBookingStore } from "@/src/stores/booking.store";
import { useSlotsByMealType } from "@/src/hooks/useSlots";
import { SlotCard } from "./SlotCard";
import { SlotCardSkeleton } from "./SlotCardSkeleton";
import { MemberCounter } from "./MemberCounter";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

export function SlotList() {
	const router = useRouter();
	const { mealType, slotId, members, setSlot, setMembers } = useBookingStore();
	const { data: slots, isLoading, isError } = useSlotsByMealType(mealType);

	if (isError) {
		return (
			<div className="p-4 text-center text-red-500 rounded-xl bg-red-50 border border-red-100">
				Failed to load slots. Please try again later.
			</div>
		);
	}

	const handleContinue = () => {
		if (slotId) {
			router.push(`/menu?type=${mealType}`);
		}
	};

	// Get all active slots (including those that might be full for display)
	const activeSlots = slots?.filter((slot) => slot.is_active) ?? [];
	// Get today's date from the first slot if available
	const slotDate = activeSlots[0]?.slot_date;

	return (
		<div className="space-y-6">
			<MemberCounter count={members} onChange={setMembers} />

			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<h3 className="font-bold text-gray-900">Select Time Slot</h3>
					{slotDate && (
						<div className="flex items-center gap-1 text-sm text-gray-500">
							<CalendarDays size={14} />
							<span>
								{new Date(slotDate).toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 gap-3">
					{isLoading ? (
						Array.from({ length: 3 }).map((_, i) => <SlotCardSkeleton key={i} />)
					) : activeSlots.length === 0 ? (
						<div className="p-4 text-center text-gray-500 rounded-xl bg-gray-50 border border-gray-100">
							No available slots for {mealType} today.
						</div>
					) : (
						activeSlots.map((slot) => (
							<SlotCard
								key={slot.slot_id}
								slot={slot}
								isSelected={slotId === slot.slot_id.toString()}
								isDisabled={slot.remaining_capacity < members || slot.is_full}
								onSelect={setSlot}
							/>
						))
					)}
				</div>
			</div>

			<button
				onClick={handleContinue}
				disabled={!slotId}
				className="w-full rounded-2xl bg-blue-600 p-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 active:scale-[0.98]"
			>
				Confirm Slot & Choose Meal
			</button>
		</div>
	);
}
