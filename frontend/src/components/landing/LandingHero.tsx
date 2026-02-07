import { FloatingFoodIcons } from "./FloatingFoodIcons";

type LandingHeroProps = {
	title: string;
	subtitle: string;
};

export function LandingHero({ title }: LandingHeroProps) {
	return (
		<section className="relative bg-blue-600 text-white overflow-hidden">
			{/* RANDOM FLOATING ICONS */}
			<FloatingFoodIcons />

			{/* HERO CONTENT */}
			<div className="relative z-10 container mx-auto px-4 pt-32 pb-16 text-center">
				{/* MAIN HEADING */}
				<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8">{title}</h1>

				{/* SUB HEADING */}
				<div className="mx-auto max-w-4xl text-center space-y-6 text-lg md:text-xl text-blue-100 leading-relaxed">
					<p>Tired of waiting in long cafeteria queues or missing your favorite meals?</p>

					<p>
						With Smart Cafeteria Management System, you can pre-book meals, manage orders
						effortlessly, and enjoy a hassle-free dining experience.
					</p>

					<p className="font-semibold text-white">
						Smarter planning, faster service, and better meals — all in one place.
					</p>
				</div>
			</div>
		</section>
	);
}
