import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingService } from "@/src/services/booking.service";
import type { CreateBookingPayload } from "@/src/types/booking.types";

/**
 * Hook for searching users by email (debounced on the component side).
 * Uses keepPreviousData to avoid flicker between keystrokes.
 */
export function useSearchUsers(email: string) {
	return useQuery({
		queryKey: ["searchUsers", email],
		queryFn: () => BookingService.searchUsersByEmail(email),
		enabled: email.length >= 2,
		staleTime: 30 * 1000,
		placeholderData: (prev) => prev,
		select: (response) => {
			if (!response.success || !response.data) return [];
			return response.data;
		},
	});
}

/**
 * Hook for creating a booking.
 * Invalidates bookings query on success and shows toast feedback.
 */
export function useCreateBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateBookingPayload) => BookingService.createBooking(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
		},
	});
}
