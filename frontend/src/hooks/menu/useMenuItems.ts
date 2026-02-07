import { useQuery } from "@tanstack/react-query";
import { BookingService } from "@/src/services/booking.service";
import type { MenuItemData } from "@/src/types/booking.types";

/**
 * Hook to fetch menu items by slot ID
 * Uses the slot ID stored in booking store to get the menu for the selected slot
 */
export function useMenuItems(slotId: string | null) {
	return useQuery({
		queryKey: ["menu", slotId],
		queryFn: async () => {
			if (!slotId) throw new Error("Slot ID is required");
			const response = await BookingService.getMenuBySlotId(slotId);
			return response;
		},
		enabled: !!slotId,
		staleTime: 5 * 60 * 1000,
		select: (response) => {
			if (!response.success || !response.data) {
				return [];
			}
			return response.data;
		},
	});
}
