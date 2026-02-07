import { LandingHero } from "@/components/landing/LandingHero";
import { MealCategoryGrid } from "@/components/landing/MealCategoryGrid";
import { LandingInfo } from "@/components/landing/LandingInfo";

export default function HomePage() {
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
