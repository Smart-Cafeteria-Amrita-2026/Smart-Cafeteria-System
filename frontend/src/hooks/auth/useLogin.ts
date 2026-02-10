import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginPayload, LoginResponse } from "@/types/auth.types";

export function useLogin() {
	const router = useRouter();
	const setToken = useAuthStore((s) => s.setToken);
	const setEmail = useAuthStore((s) => s.setEmail);

	return useMutation({
		mutationFn: (payload: LoginPayload) => AuthService.login(payload),
		onSuccess: (response: LoginResponse, payload: LoginPayload) => {
			if (response?.success && response?.data?.accessToken) {
				setToken(response.data.accessToken);
				// Use email from response, fallback to the login payload email
				setEmail(response.data.email || payload.email);
				toast.success("Login successful!");

				const redirect = "/otp";
				router.push(redirect);
			}
		},
		onError: () => {
			toast.error("Invalid email or password");
		},
	});
}
