import Image from "next/image";
import { useMemo } from "react";

const ICONS = [
	"/assets/hero-icons/food-1.png",
	"/assets/hero-icons/food-2.png",
	"/assets/hero-icons/food-3.png",
	"/assets/hero-icons/food-4.png",
	"/assets/hero-icons/food-5.png",
	"/assets/hero-icons/food-6.png",
	"/assets/hero-icons/food-7.png",
	"/assets/hero-icons/food-8.png",
	"/assets/hero-icons/food-9.png",
	"/assets/hero-icons/food-10.png",
];

// Wide spread zones (avoids center text area)
const BASE_POSITIONS = [
	{ top: 8, left: 8 },
	{ top: 12, left: 82 },
	{ top: 28, left: 5 },
	{ top: 30, left: 88 },
	{ top: 50, left: 6 },
	{ top: 55, left: 85 },
	{ top: 70, left: 15 },
	{ top: 72, left: 75 },
	{ top: 85, left: 30 },
	{ top: 88, left: 60 },
];

export function FloatingFoodIcons() {
	// 🔒 Lock randomness ONCE
	const icons = useMemo(() => {
		return ICONS.map((src, index) => {
			const base = BASE_POSITIONS[index % BASE_POSITIONS.length];

			return {
				src,
				size: 65 + Math.random() * 35, // 65–100px
				top: base.top + Math.random() * 4, // small offset
				left: base.left + Math.random() * 4, // small offset
				duration: 12 + Math.random() * 8, // 12–20s   // slow & smooth
				delay: Math.random() * 6,
			};
		});
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{icons.map((icon, index) => (
				<div
					key={index}
					className="absolute animate-float-luxury"
					style={{
						top: `${icon.top}%`,
						left: `${icon.left}%`,
						width: icon.size,
						height: icon.size,
						animationDuration: `${icon.duration}s`,
						animationDelay: `${icon.delay}s`,
					}}
				>
					<Image
						src={icon.src}
						alt="Floating food icon"
						width={icon.size}
						height={icon.size}
						className="opacity-10 select-none"
					/>
				</div>
			))}
		</div>
	);
}
