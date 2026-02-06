import { useMutation } from "@tanstack/react-query";
// import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import type { LoginPayload } from "@/types/auth.types";

export function useLogin() {
	// const router = useRouter();

	return useMutation({
		mutationFn: (payload: LoginPayload) => AuthService.login(payload),
		onSuccess: () => {
			toast.success("OTP sent successfully");
			// router.push('/otp');
		},
		onError: () => {
			toast.error("Invalid email or password");
		},
	});
}
