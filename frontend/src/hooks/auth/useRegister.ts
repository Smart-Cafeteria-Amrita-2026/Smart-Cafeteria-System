import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import type { RegisterPayload } from "@/types/auth.types";

export function useRegister() {
	const router = useRouter();

	return useMutation({
		mutationFn: (payload: RegisterPayload) => AuthService.register(payload),

		onSuccess: () => {
			toast.success("Registration successful. Please login.");
			router.push("/login");
		},

		onError: () => {
			toast.error("Registration failed");
		},
	});
}
