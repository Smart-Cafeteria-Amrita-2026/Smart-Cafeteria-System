import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MealType, BookingSession } from '../types/booking.types';

interface BookingStoreState extends BookingSession {
    setMealType: (type: MealType) => void;
    setSlot: (slotId: string | null) => void;
    setMembers: (count: number) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingStoreState>()(
    persist(
        (set) => ({
            mealType: null,
            slotId: null,
            members: 1,

            setMealType: (mealType) => set({ mealType, slotId: null }),
            setSlot: (slotId) => set({ slotId }),
            setMembers: (members) => set({ members }),
            resetBooking: () => set({ mealType: null, slotId: null, members: 1 }),
        }),
        {
            name: 'booking-store',
        }
    )
);
