import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { VerifyOtpPayload } from "@/types/auth.types";

export function useVerifyOtp() {
	const router = useRouter();
	const setToken = useAuthStore((s) => s.setToken);

	return useMutation({
		mutationFn: (payload: VerifyOtpPayload) => AuthService.verifyOtp(payload),
		onSuccess: (data) => {
			setToken(data.token);
			toast.success("OTP verified successfully");
			router.push("/");
		},
		onError: () => {
			toast.error("Invalid OTP");
		},
	});
}
