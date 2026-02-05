'use client';

import { useBookingStore } from '@/stores/booking.store';
import { useSlots } from '../hooks/useSlots';
import { SlotCard } from './SlotCard';
import { SlotCardSkeleton } from './SlotCardSkeleton';
import { MemberCounter } from './MemberCounter';
import { useRouter } from 'next/navigation';

export function SlotList() {
    const router = useRouter();
    const { mealType, slotId, members, setSlot, setMembers } = useBookingStore();
    const { data: slots, isLoading, error } = useSlots(mealType);

    if (error) {
        return <div className="p-4 text-center text-red-500">Failed to load slots.</div>;
    }

    const handleContinue = () => {
        if (slotId) {
            router.push(`/menu?type=${mealType}`);
        }
    };

    return (
        <div className="space-y-6">
            <MemberCounter count={members} onChange={setMembers} />

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900 px-1">Select Time Slot</h3>
                <div className="grid grid-cols-1 gap-3">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <SlotCardSkeleton key={i} />)
                    ) : (
                        slots?.map((slot) => (
                            <SlotCard
                                key={slot.id}
                                slot={slot}
                                isSelected={slotId === slot.id}
                                isDisabled={slot.availableSeats < members}
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
