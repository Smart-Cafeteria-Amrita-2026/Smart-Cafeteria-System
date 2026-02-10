import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import type { GenerateOtpPayload } from "@/types/auth.types";

export function useGenerateOtp() {
	return useMutation({
		mutationFn: (payload: GenerateOtpPayload) => AuthService.generateOtp(payload),
		onSuccess: () => {
			toast.success("OTP sent to your email!");
		},
		onError: () => {
			toast.error("Failed to generate OTP. Please try again.");
		},
	});
}
