"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MealCategoryConfig } from "@/types/booking.types";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Dumb component: StaffMealCategoryCard
interface StaffMealCategoryCardProps {
	meal: MealCategoryConfig;
}

function StaffMealCategoryCard({ meal }: StaffMealCategoryCardProps) {
	return (
		<Link
			href={meal.href ? meal.href : `/staff/slots?type=${meal.id}`}
			className="meal-card group relative overflow-hidden rounded-3xl bg-white p-6 text-center shadow-lg shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 sm:p-8"
		>
			{/* Gradient overlay on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

			<div className="relative">
				<div className="relative mx-auto mb-6 h-28 w-28 sm:h-32 sm:w-32">
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
					<Image
						src={meal.image}
						alt={meal.title}
						fill
						className="object-contain transition-transform duration-500 group-hover:scale-110"
					/>
				</div>

				<h3 className="mb-2 text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600 sm:text-xl">
					{meal.title}
				</h3>

				<p className="text-sm leading-relaxed text-gray-500 sm:text-base">{meal.caption}</p>

				{/* Arrow indicator */}
				<div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-500 opacity-0 transition-all duration-300 group-hover:opacity-100">
					<span>Manage Slots</span>
					<svg
						aria-hidden="true"
						className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</div>
			</div>
		</Link>
	);
}

// Smart component: StaffMealCategoryGrid
export function StaffMealCategoryGrid() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	// Always show all four categories, fallback to static config if API returns empty
	const mealCategories: MealCategoryConfig[] = [
		{
			id: "breakfast",
			title: "Breakfast",
			caption: "Start your day fresh & energized",
			image: "/assets/meals/breakfast.jpg",
			href: "/staff/slots?type=breakfast",
		},
		{
			id: "lunch",
			title: "Lunch",
			caption: "Hearty meals to power your day",
			image: "/assets/meals/lunch.jpg",
			href: "/staff/slots?type=lunch",
		},
		{
			id: "dinner",
			title: "Dinner",
			caption: "End your day with comfort food",
			image: "/assets/meals/dinner.jpg",
			href: "/staff/slots?type=dinner",
		},
		{
			id: "snack",
			title: "Snacks",
			caption: "Quick bites for short breaks",
			image: "/assets/meals/snacks.jpg",
			href: "/staff/slots?type=snack",
		},
	];

	useGSAP(
		() => {
			if (!mealCategories || mealCategories.length === 0) return;

			// Animate heading
			gsap.fromTo(
				headingRef.current,
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 80%",
						toggleActions: "play none none reverse",
					},
				}
			);

			// Animate cards with stagger
			gsap.fromTo(
				gridRef.current?.querySelectorAll(".meal-card") ?? [],
				{ opacity: 0, y: 60, scale: 0.9 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.7,
					ease: "power3.out",
					stagger: 0.15,
					scrollTrigger: {
						trigger: gridRef.current,
						start: "top 75%",
						toggleActions: "play none none reverse",
					},
				}
			);
		},
		{ scope: sectionRef, dependencies: [mealCategories] }
	);

	return (
		<section
			id="staff-meal-categories"
			ref={sectionRef}
			className="relative py-8 sm:py-12 lg:py-16"
		>
			{/* Decorative elements */}
			<div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					ref={headingRef}
					className="mb-14 text-center text-3xl font-bold text-white opacity-0 sm:mb-16 sm:text-4xl"
				>
					Select a{" "}
					<span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
						Meal Category
					</span>
				</h2>

				<div
					ref={gridRef}
					className={`mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl gap-6 sm:gap-8`}
				>
					{mealCategories.map((meal) => (
						<StaffMealCategoryCard key={meal.id} meal={meal} />
					))}
				</div>
			</div>
		</section>
	);
}
