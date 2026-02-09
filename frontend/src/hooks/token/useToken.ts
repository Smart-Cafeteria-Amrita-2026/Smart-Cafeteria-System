import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { TokenService } from "@/src/services/token/TokenService";
import type { TokenWithDetails, TokenGenerationResponse } from "@/src/types/token.types";

/**
 * Generate a token after successful bill settlement.
 * Call `mutate(bookingId)` to trigger.
 */
export function useGenerateToken() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (bookingId: number) => TokenService.generateToken(bookingId),
		onSuccess: (_data, bookingId) => {
			toast.success("Token generated successfully!");
			queryClient.invalidateQueries({ queryKey: ["bookingToken"] });
			queryClient.invalidateQueries({ queryKey: ["bookingDetail", bookingId] });
			queryClient.invalidateQueries({ queryKey: ["myBookings"] });
		},
		onError: (error: unknown) => {
			// Token generation may fail if token already exists — that's okay
			const err = error as { response?: { data?: { error?: string; message?: string } } };
			const msg = err?.response?.data?.error || err?.response?.data?.message || "";
			if (msg.toLowerCase().includes("already exists")) {
				// Silently ignore — token was already generated
				return;
			}
			toast.error(msg || "Failed to generate token.");
		},
	});
}

/**
 * Fetch token by booking reference.
 * Returns null-safe — if no token exists yet, data will be undefined.
 */
export function useTokenByBookingReference(bookingReference: string | undefined) {
	return useQuery<TokenWithDetails | null>({
		queryKey: ["bookingToken", bookingReference],
		queryFn: async () => {
			if (!bookingReference) return null;
			try {
				const response = await TokenService.getTokenByBookingReference(bookingReference);
				return response.data;
			} catch {
				// 404 means no token yet — not an error for the UI
				return null;
			}
		},
		enabled: !!bookingReference,
		staleTime: 30 * 1000,
		retry: false,
	});
}

/**
 * Fetch full token details by token ID.
 */
export function useTokenDetails(tokenId: number | undefined) {
	return useQuery<TokenWithDetails>({
		queryKey: ["tokenDetails", tokenId],
		queryFn: async () => {
			const response = await TokenService.getTokenDetails(tokenId!);
			return response.data;
		},
		enabled: !!tokenId && tokenId > 0,
		staleTime: 30 * 1000,
	});
}
