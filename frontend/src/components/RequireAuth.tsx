"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const token = useAuthStore((state) => state.token);
	const isHydrated = useAuthStore((state) => state.isHydrated);

	useEffect(() => {
		if (!isHydrated) return;
		if (!token) {
			router.replace("/login");
		}
	}, [isHydrated, token, router]);

	if (!isHydrated || !token) {
		return null;
	}

	return <>{children}</>;
}
