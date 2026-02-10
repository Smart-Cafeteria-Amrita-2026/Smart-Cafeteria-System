import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import type { ResendOtpPayload } from "@/types/auth.types";

export function useResendOtp() {
	return useMutation({
		mutationFn: (payload: ResendOtpPayload) => AuthService.resendOtp(payload),
		onSuccess: () => {
			toast.success("OTP resent successfully!");
		},
		onError: () => {
			toast.error("Failed to resend OTP. Please try again.");
		},
	});
}
