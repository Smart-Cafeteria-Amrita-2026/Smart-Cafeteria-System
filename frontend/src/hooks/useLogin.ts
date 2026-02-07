import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "react-hot-toast";

type LoginPayload = {
	email: string;
	password: string;
};

export function useLogin() {
	const router = useRouter();
	const setToken = useAuthStore((s) => s.setToken);

	return useMutation({
		mutationFn: (payload: LoginPayload) => AuthService.login(payload),

		onSuccess: (data: any) => {
			if (data?.token) {
				setToken(data.token);
			}

			toast.success("Login successful!");

			const params = new URLSearchParams(window.location.search);
			const redirect = params.get("redirect") || "/";
			router.push(redirect);
		},

		onError: (error: any) => {
			const msg = error?.response?.data?.message || "Login failed";
			toast.error(msg);
			console.error("Login failed:", error);
		},
	});
}
