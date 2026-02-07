import { useQuery } from "@tanstack/react-query";
import { BookingService } from "@/src/services/booking.service";
import type { MealType, MealCategoryConfig, SlotData } from "@/src/types/booking.types";
import { useBookingStore } from "@/src/stores/booking.store";

// Static meal category configurations
const MEAL_CATEGORY_CONFIG: Record<MealType, Omit<MealCategoryConfig, "id" | "href">> = {
	breakfast: {
		title: "Breakfast",
		caption: "Start your day fresh & energized",
		image: "/assets/meals/breakfast.jpg",
	},
	lunch: {
		title: "Lunch",
		caption: "Hearty meals to power your day",
		image: "/assets/meals/lunch.jpg",
	},
	snack: {
		title: "Snacks",
		caption: "Quick bites for short breaks",
		image: "/assets/meals/snacks.jpg",
	},
	dinner: {
		title: "Dinner",
		caption: "End your day with comfort food",
		image: "/assets/meals/dinner.jpg",
	},
};

/**
 * Extract meal type from slot name
 * Matches "Breakfast", "Lunch", "Snacks", "Dinner" (case-insensitive)
 */
function extractMealTypeFromSlotName(slotName: string): MealType | null {
	const lowerName = slotName.toLowerCase();
	if (lowerName.includes("breakfast")) return "breakfast";
	if (lowerName.includes("lunch")) return "lunch";
	if (lowerName.includes("snack")) return "snack";
	if (lowerName.includes("dinner")) return "dinner";
	return null;
}

/**
 * Get unique available meal categories from slots
 */
function getAvailableCategoriesFromSlots(slots: SlotData[]): MealCategoryConfig[] {
	// Filter slots with remaining capacity > 0 and extract unique meal types
	const availableMealTypes = new Set<MealType>();

	for (const slot of slots) {
		if (slot.remaining_capacity > 0 && slot.is_active) {
			const mealType = extractMealTypeFromSlotName(slot.slot_name);
			if (mealType) {
				availableMealTypes.add(mealType);
			}
		}
	}

	// Order categories by meal time
	const orderedMealTypes: MealType[] = ["breakfast", "lunch", "snack", "dinner"];

	return orderedMealTypes
		.filter((type) => availableMealTypes.has(type))
		.map((type) => ({
			id: type,
			href: `/slots?type=${type}`,
			...MEAL_CATEGORY_CONFIG[type],
		}));
}

/**
 * Hook to fetch available meal categories for today
 * Returns only categories that have at least one slot with capacity > 0
 */
export function useAvailableCategories() {
	const setAvailableSlots = useBookingStore((state) => state.setAvailableSlots);

	return useQuery({
		queryKey: ["availableSlots"],
		queryFn: async () => {
			const response = await BookingService.getAvailableSlots();

			// Store slots in Zustand for use on the next page
			if (response.success && response.data) {
				setAvailableSlots(response.data);
			}

			return response;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		select: (response) => {
			if (!response.success || !response.data) {
				return [];
			}
			return getAvailableCategoriesFromSlots(response.data);
		},
	});
}

/**
 * Hook to fetch slots for a specific meal type
 * Returns SlotData[] for the slots page
 */
export function useSlotsByMealType(type: MealType | null) {
	return useQuery({
		queryKey: ["slots", type],
		queryFn: () => {
			if (!type) throw new Error("Meal type is required");
			return BookingService.getSlotsByType(type);
		},
		enabled: !!type,
		staleTime: 2 * 60 * 1000, // 2 minutes for more frequent updates
		select: (response) => {
			if (!response.success || !response.data) {
				return [];
			}
			return response.data;
		},
	});
}

/**
 * Hook to fetch user's bookings
 * Protected endpoint - requires auth
 */
export function useBookings() {
	return useQuery({
		queryKey: ["bookings"],
		queryFn: BookingService.getBookings,
		staleTime: 2 * 60 * 1000,
		select: (response) => {
			if (!response.success || !response.data) {
				return [];
			}
			return response.data;
		},
	});
}
