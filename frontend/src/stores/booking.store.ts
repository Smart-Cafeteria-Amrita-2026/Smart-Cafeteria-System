import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MealType, BookingSession, SlotData, UserSearchResult } from "../types/booking.types";

interface BookingStoreState extends BookingSession {
	availableSlots: SlotData[];
	groupMembers: UserSearchResult[];
	setMealType: (type: MealType) => void;
	setSlot: (slotId: string | null) => void;
	setMembers: (count: number) => void;
	setAvailableSlots: (slots: SlotData[]) => void;
	getSlotsByMealType: (type: MealType) => SlotData[];
	addGroupMember: (user: UserSearchResult) => void;
	removeGroupMember: (userId: string) => void;
	clearGroupMembers: () => void;
	getSelectedSlot: () => SlotData | undefined;
	resetBooking: () => void;
}

export const useBookingStore = create<BookingStoreState>()(
	persist(
		(set, get) => ({
			mealType: null,
			slotId: null,
			members: 1,
			availableSlots: [],
			groupMembers: [],

			setMealType: (mealType) => set({ mealType, slotId: null }),
			setSlot: (slotId) => set({ slotId }),
			setMembers: (members) => set({ members }),
			setAvailableSlots: (availableSlots) => set({ availableSlots }),
			addGroupMember: (user) =>
				set((state) => {
					if (state.groupMembers.find((m) => m.id === user.id)) return state;
					return { groupMembers: [...state.groupMembers, user] };
				}),
			removeGroupMember: (userId) =>
				set((state) => ({
					groupMembers: state.groupMembers.filter((m) => m.id !== userId),
				})),
			clearGroupMembers: () => set({ groupMembers: [] }),
			getSelectedSlot: () => {
				const { availableSlots, slotId } = get();
				if (!slotId) return undefined;
				return availableSlots.find((s) => s.slot_id.toString() === slotId);
			},
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
			resetBooking: () =>
				set({ mealType: null, slotId: null, members: 1, availableSlots: [], groupMembers: [] }),
		}),
		{
			name: "booking-store",
		}
	)
);
