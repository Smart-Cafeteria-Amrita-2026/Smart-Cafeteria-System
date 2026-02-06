import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import type { ForgotPasswordPayload } from "@/types/auth.types";

export function useForgotPassword() {
	return useMutation({
		mutationFn: (payload: ForgotPasswordPayload) => AuthService.forgotPassword(payload),

		onSuccess: () => {
			toast.success("Reset link sent. Check your email.");
		},

		onError: () => {
			toast.error("Failed to send reset link");
		},
	});
}
