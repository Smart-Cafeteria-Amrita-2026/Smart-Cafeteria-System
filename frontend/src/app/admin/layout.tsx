"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useAuthStore } from "@/stores/auth.store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { isAdmin, isLoading } = useRole();
	const { isAuthenticated, isHydrated } = useAuthStore();

	useEffect(() => {
		if (!isHydrated || isLoading) return;

		if (!isAuthenticated) {
			router.replace("/login");
			return;
		}

		if (!isAdmin) {
			router.replace("/");
		}
	}, [isHydrated, isLoading, isAuthenticated, isAdmin, router]);

	if (!isHydrated || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-gray-500">Loading...</div>
			</div>
		);
	}

	if (!isAdmin) {
		return null;
	}

	return <>{children}</>;
}
