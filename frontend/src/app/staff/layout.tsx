"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useAuthStore } from "@/stores/auth.store";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { isStaff, isLoading } = useRole();
	const { token, isHydrated } = useAuthStore();

	useEffect(() => {
		// Wait for hydration
		if (!isHydrated || isLoading) return;

		// Redirect if not logged in
		if (!token) {
			router.replace("/login");
			return;
		}

		// Redirect if not staff
		if (!isStaff) {
			router.replace("/");
		}
	}, [isHydrated, isLoading, token, isStaff, router]);

	// Show loading while hydrating
	if (!isHydrated || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-gray-500">Loading...</div>
			</div>
		);
	}

	// Don't render children if not staff
	if (!isStaff) {
		return null;
	}

	return <>{children}</>;
}
