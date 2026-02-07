"use client";

import Image from "next/image";
import Link from "next/link";
import { useAvailableCategories } from "@/src/hooks/useSlots";
import { MealCategoryGridSkeleton } from "./MealCategoryGridSkeleton";
import type { MealCategoryConfig } from "@/src/types/booking.types";

// Dumb component: MealCategoryCard
interface MealCategoryCardProps {
	meal: MealCategoryConfig;
}

function MealCategoryCard({ meal }: MealCategoryCardProps) {
	return (
		<Link
			href={meal.href}
			className="bg-white rounded-2xl p-6 text-center hover:scale-[1.03] transition"
		>
			<div className="relative h-32 w-full mb-4">
				<Image src={meal.image} alt={meal.title} fill className="object-contain" />
			</div>

			<h3 className="text-lg font-semibold text-blue-600">{meal.title}</h3>

			<p className="mt-2 text-sm text-gray-600">{meal.caption}</p>
		</Link>
	);
}

// Smart component: MealCategoryGrid
export function MealCategoryGrid() {
	const { data: categories, isLoading, isError } = useAvailableCategories();

	if (isLoading) {
		return <MealCategoryGridSkeleton />;
	}

	if (isError) {
		return (
			<section className="bg-blue-600 py-24">
				<div className="container mx-auto px-4 text-center">
					<p className="text-white text-lg">
						Unable to load meal categories. Please try again later.
					</p>
				</div>
			</section>
		);
	}

	if (!categories || categories.length === 0) {
		return (
			<section className="bg-blue-600 py-24">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-semibold text-white mb-6">Explore Meals</h2>
					<p className="text-white/80 text-lg">
						No meal slots available at this time. Please check back later.
					</p>
				</div>
			</section>
		);
	}

	// Dynamically set grid columns based on number of categories
	const gridCols =
		categories.length === 1
			? "grid-cols-1"
			: categories.length === 2
				? "grid-cols-1 sm:grid-cols-2"
				: categories.length === 3
					? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
					: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";

	return (
		<section className="bg-blue-600 py-24">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-semibold text-center text-white mb-14">Explore Meals</h2>

				<div className={`grid ${gridCols} gap-8`}>
					{categories.map((meal) => (
						<MealCategoryCard key={meal.id} meal={meal} />
					))}
				</div>
			</div>
		</section>
	);
}
