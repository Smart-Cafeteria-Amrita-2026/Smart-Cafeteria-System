"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

const INFO_CARDS = [
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
				/>
			</svg>
		),
		title: "Pre-book Meals",
		description:
			"Plan your meals in advance and skip long queues. Smart pre-booking ensures availability and saves your valuable time.",
		gradient: "from-orange-500 to-amber-500",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
				/>
			</svg>
		),
		title: "Reduce Food Wastage",
		description:
			"Demand forecasting helps the cafeteria prepare the right quantity of food, minimizing waste and promoting sustainability.",
		gradient: "from-amber-500 to-orange-500",
	},
	{
		icon: (
			<svg
				aria-hidden="true"
				className="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
				/>
			</svg>
		),
		title: "Efficient Operations",
		description:
			"Smooth coordination between students, staff, and administrators results in faster service and better management.",
		gradient: "from-orange-600 to-amber-500",
	},
];

export function LandingInfo() {
	const sectionRef = useRef<HTMLElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
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
				cardsRef.current?.querySelectorAll(".info-card") ?? [],
				{ opacity: 0, y: 80 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.2,
					scrollTrigger: {
						trigger: cardsRef.current,
						start: "top 75%",
						toggleActions: "play none none reverse",
					},
				}
			);
		},
		{ scope: sectionRef }
	);

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden bg-gradient-to-b from-amber-200 via-orange-200 to-amber-300 py-24 sm:py-32"
		>
			{/* Decorative background elements */}
			<div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-300/35 blur-3xl" />
			<div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />

			<div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
				<h2
					ref={headingRef}
					className="mb-16 text-center text-3xl font-bold text-gray-900 opacity-0 sm:text-4xl lg:text-5xl"
				>
					Why{" "}
					<span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
						Smart Cafeteria
					</span>
					?
				</h2>

				<div ref={cardsRef} className="mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-3">
					{INFO_CARDS.map((card) => (
						<div
							key={card.title}
							className="info-card group relative overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-8 shadow-xl shadow-orange-300/30 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-orange-200/60 hover:shadow-2xl hover:shadow-orange-400/40"
						>
							{/* Gradient top border on hover */}
							<div
								className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
							/>

							{/* Icon */}
							<div
								className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${card.gradient} p-4 text-white shadow-lg shadow-orange-300/40 ring-1 ring-orange-200/60 transition-transform duration-300 group-hover:scale-105`}
							>
								{card.icon}
							</div>

							<h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[var(--color-primary)]">
								{card.title}
							</h3>

							<p className="text-base leading-relaxed text-gray-600">{card.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
