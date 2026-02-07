import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MealType, BookingSession, SlotData } from "../types/booking.types";

interface BookingStoreState extends BookingSession {
	availableSlots: SlotData[];
	setMealType: (type: MealType) => void;
	setSlot: (slotId: string | null) => void;
	setMembers: (count: number) => void;
	setAvailableSlots: (slots: SlotData[]) => void;
	getSlotsByMealType: (type: MealType) => SlotData[];
	resetBooking: () => void;
}

export const useBookingStore = create<BookingStoreState>()(
	persist(
		(set, get) => ({
			mealType: null,
			slotId: null,
			members: 1,
			availableSlots: [],

			setMealType: (mealType) => set({ mealType, slotId: null }),
			setSlot: (slotId) => set({ slotId }),
			setMembers: (members) => set({ members }),
			setAvailableSlots: (availableSlots) => set({ availableSlots }),
			getSlotsByMealType: (type: MealType) => {
				const slots = get().availableSlots;
				return slots.filter((slot) => {
					const lowerName = slot.slot_name.toLowerCase();
					switch (type) {
						case "breakfast":
							return lowerName.includes("breakfast");
						case "lunch":
							return lowerName.includes("lunch");
						case "snack":
							return lowerName.includes("snack");
						case "dinner":
							return lowerName.includes("dinner");
						default:
							return false;
					}
				});
			},
			resetBooking: () => set({ mealType: null, slotId: null, members: 1, availableSlots: [] }),
		}),
		{
			name: "booking-store",
		}
	)
);
