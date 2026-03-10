"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LandingHero } from "@/components/landing/LandingHero";
import { MealCategoryGrid } from "@/components/landing/MealCategoryGrid";
import { LandingInfo } from "@/components/landing/LandingInfo";
import { useRole } from "@/hooks/useRole";
import { useAuthStore } from "@/stores/auth.store";

export default function HomePage() {
	const router = useRouter();
	const { isStaff, isAdmin, isLoading } = useRole();
	const { isAuthenticated, isHydrated } = useAuthStore();

	// Redirect staff/admin users to their dashboard
	useEffect(() => {
		if (!isHydrated || isLoading) return;

		if (isAuthenticated && isStaff) {
			router.replace("/staff");
		} else if (isAuthenticated && isAdmin) {
			router.replace("/admin");
		}
	}, [isHydrated, isLoading, isAuthenticated, isStaff, isAdmin, router]);

	// Show loading while checking role for logged-in users
	if (isAuthenticated && (!isHydrated || isLoading)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-gray-500">Loading...</div>
			</div>
		);
	}

	// If staff or admin, don't render landing page (redirect will happen)
	if (isAuthenticated && (isStaff || isAdmin)) {
		return null;
	}

	return (
		<>
			{/* HERO (BLUE) */}
			<LandingHero
				title="Smart Cafeteria Management System"
				subtitle="Pre-book meals, avoid queues, and enjoy seamless dining with a smarter cafeteria experience."
			/>

			{/* MEAL SECTION (FULL BLUE, NO SIDE GAPS) */}
			<MealCategoryGrid />

			{/* WHY SMART CAFETERIA (FULL WHITE) */}
			<LandingInfo />
		</>
	);
}
