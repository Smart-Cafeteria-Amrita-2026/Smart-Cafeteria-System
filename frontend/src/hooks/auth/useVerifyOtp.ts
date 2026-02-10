import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import type { VerifyOtpPayload } from "@/types/auth.types";

export function useVerifyOtp() {
	const router = useRouter();

	return useMutation({
		mutationFn: (payload: VerifyOtpPayload) => AuthService.verifyOtp(payload),
		onSuccess: (data) => {
			if (data.success && data.data?.verified) {
				toast.success("OTP verified successfully");
				router.push("/");
			}
		},
		onError: () => {
			toast.error("Invalid OTP. Please try again.");
		},
	});
}
