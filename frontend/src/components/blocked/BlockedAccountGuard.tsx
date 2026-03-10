"use client";

import type { ReactNode } from "react";
import { useProfile } from "@/hooks/profile/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { BlockedAccountScreen } from "@/components/blocked/BlockedAccountScreen";

export function BlockedAccountGuard({ children }: { children: ReactNode }) {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const isHydrated = useAuthStore((s) => s.isHydrated);
	const { data: profile } = useProfile();

	// Only check for authenticated users whose profile has loaded
	if (isHydrated && isAuthenticated && profile?.account_status === "blocked") {
		return <BlockedAccountScreen />;
	}

	return <>{children}</>;
}
