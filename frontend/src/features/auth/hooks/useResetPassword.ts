import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "../services/auth.service";
import type { ResetPasswordPayload } from "../types/auth.types";

export function useResetPassword() {
	const router = useRouter();

	return useMutation({
		mutationFn: (payload: ResetPasswordPayload) => AuthService.resetPassword(payload),

		onSuccess: () => {
			toast.success("Password reset successful");
			router.push("/login");
		},

		onError: () => {
			toast.error("Invalid or expired reset link");
		},
	});
}
