import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WalletService } from "../../services/wallet/WalletService";
import { TokenService } from "../../services/token/TokenService";
import { toast } from "react-hot-toast";

/** Fetch the authenticated user's wallet balance */
export function useWalletBalance() {
	return useQuery({
		queryKey: ["wallet", "balance"],
		queryFn: WalletService.getWalletBalance,
		staleTime: 30 * 1000,
		select: (res) => res.data,
	});
}

/** Fetch wallet transaction history */
export function useWalletTransactions(limit = 20, offset = 0) {
	return useQuery({
		queryKey: ["wallet", "transactions", limit, offset],
		queryFn: () => WalletService.getWalletTransactions(limit, offset),
		staleTime: 30 * 1000,
		select: (res) => res.data,
	});
}

/** Create a Stripe Checkout Session for wallet recharge */
export function useCreateCheckoutSession() {
	return useMutation({
		mutationFn: (payload: { amount: number; return_url: string }) =>
			WalletService.createCheckoutSession(payload),
		onError: () => {
			toast.error("Failed to initiate wallet recharge.");
		},
	});
}

/** Poll the status of a Stripe Checkout Session */
export function useSessionStatus(sessionId: string | null) {
	return useQuery({
		queryKey: ["wallet", "session-status", sessionId],
		queryFn: () => WalletService.getSessionStatus(sessionId!),
		enabled: !!sessionId,
		refetchInterval: (query) => {
			const status = query.state.data?.data?.status;
			// Stop polling once session is complete or expired
			if (status === "complete" || status === "expired") return false;
			return 2000; // poll every 2s while open
		},
		select: (res) => res.data,
	});
}

/** Confirm wallet recharge after successful Stripe payment */
export function useConfirmRecharge() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sessionId: string) => WalletService.confirmRecharge(sessionId),
		onSuccess: (res) => {
			toast.success(`₹${res.data.amount_recharged} added to wallet!`);
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
		},
		onError: () => {
			toast.error("Failed to confirm wallet recharge.");
		},
	});
}

/** Contribute from personal wallet to a booking wallet */
export function useContribute() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ bookingId, amount }: { bookingId: string; amount: number }) =>
			WalletService.contributeToBooking(bookingId, amount),
		onSuccess: () => {
			toast.success("Contribution successful!");
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			queryClient.invalidateQueries({ queryKey: ["booking"] });
			queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
			queryClient.invalidateQueries({ queryKey: ["myBookings"] });
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string; error?: string } } };
			toast.error(
				err?.response?.data?.error || err?.response?.data?.message || "Contribution failed."
			);
		},
	});
}

/** Settle the bill for a booking using accumulated wallet balance */
export function useSettleBill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (bookingId: number) => WalletService.settleBill(bookingId),
		onSuccess: async (_data, bookingId) => {
			toast.success("Bill settled successfully!");
			queryClient.invalidateQueries({ queryKey: ["wallet"] });
			queryClient.invalidateQueries({ queryKey: ["bookingDetail"] });
			queryClient.invalidateQueries({ queryKey: ["myBookings"] });

			// Automatically generate a token after successful bill settlement
			try {
				await TokenService.generateToken(bookingId);
				toast.success("Token generated!");
				queryClient.invalidateQueries({ queryKey: ["bookingToken"] });
			} catch {
				// Token may already exist or generation may fail — don't block the flow
			}
		},
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { message?: string; error?: string } } };
			toast.error(
				err?.response?.data?.error || err?.response?.data?.message || "Failed to settle bill."
			);
		},
	});
}

// Keep legacy alias so existing imports don't break
export const useWallet = useWalletBalance;
export const useTopUp = useCreateCheckoutSession;
