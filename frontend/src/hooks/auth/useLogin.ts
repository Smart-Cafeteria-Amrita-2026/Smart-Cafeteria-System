import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginPayload, LoginResponse } from "@/types/auth.types";

export function useLogin() {
	const router = useRouter();
	const setToken = useAuthStore((s) => s.setToken);

	return useMutation({
		mutationFn: (payload: LoginPayload) => AuthService.login(payload),
		onSuccess: (response: LoginResponse) => {
			if (response?.success && response?.data?.accessToken) {
				setToken(response.data.accessToken);
				toast.success("Login successful!");

				const params = new URLSearchParams(window.location.search);
				const redirect = params.get("redirect") || "/";
				router.push(redirect);
			}
		},
		onError: () => {
			toast.error("Invalid email or password");
		},
	});
}
