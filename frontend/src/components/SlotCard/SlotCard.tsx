"use client";

import { useState, useEffect } from "react";
import { MEAL_TYPES } from "@/src/lib/constants";
import { MealType } from "@/src/lib/types/staff";
import styles from "./SlotCard.module.css";

interface SlotCardProps {
	timing: string;
	mealType: MealType;
	startTime: string;
	endTime: string;
	capacity: number;
	booked?: number;
}

export default function SlotCard({
	timing,
	mealType,
	startTime,
	endTime,
	capacity,
	booked: initialBooked,
}: SlotCardProps) {
	const [mounted, setMounted] = useState(false);
	const [booked, setBooked] = useState(initialBooked || 0);

	useEffect(() => {
		setMounted(true);
		if (initialBooked === undefined) {
			// Deterministic "random" number so it doesn't jump on every re-render
			const slotHash = timing.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
			setBooked((slotHash % 20) + 15);
		} else {
			setBooked(initialBooked);
		}
	}, [timing, initialBooked]);

	const isSlotActive = () => {
		if (!mounted) return false; // Server always sees as inactive to match initial client render
		const now = new Date();
		const currentTime = now.getHours() * 60 + now.getMinutes();
		const [startH, startM] = startTime.split(":").map(Number);
		const [endH, endM] = endTime.split(":").map(Number);
		return currentTime >= startH * 60 + startM && currentTime <= endH * 60 + endM;
	};

	const active = isSlotActive();
	const percentage = (booked / capacity) * 100;

	// We return a skeleton or "empty" state if not mounted to ensure
	// the server HTML matches the first client pass perfectly.
	return (
		<div className={`${styles.card} ${active ? styles.active : ""}`}>
			<div className={styles.cardHeader}>
				<div className={styles.mealType}>
					<span className={styles.mealIcon}>
						{mealType === "BREAKFAST"
							? "🥐"
							: mealType === "LUNCH"
								? "🍱"
								: mealType === "SNACKS"
									? "🥪"
									: "🍛"}
					</span>
					<span className={styles.mealLabel}>
						{MEAL_TYPES[mealType].charAt(0).toUpperCase() + MEAL_TYPES[mealType].slice(1)}
					</span>
				</div>
				<div className={styles.timing}>
					<span className={styles.timeIcon}>🕐</span>
					<span>{timing}</span>
				</div>
			</div>

			<div className={styles.progressSection}>
				<div className={styles.progressBar}>
					<div
						className={styles.progressFill}
						style={{
							// Use 0% on server, real % on client
							width: mounted ? `${percentage}%` : "0%",
							backgroundColor: `hsl(var(--${mealType.toLowerCase()}))`,
						}}
					/>
				</div>
				<div className={styles.progressStats}>
					<span className={styles.booked}>{mounted ? booked : "--"} booked</span>
					<span className={styles.available}>{mounted ? capacity - booked : "--"} available</span>
				</div>
			</div>

			<div className={styles.capacityInfo}>
				<div className={styles.capacityItem}>
					<span className={styles.capacityLabel}>Capacity:</span>
					<span className={styles.capacityValue}>{capacity}</span>
				</div>
				<div className={styles.capacityItem}>
					<span className={styles.capacityLabel}>Status:</span>
					<span
						className={`${styles.status} ${active ? styles.activeStatus : styles.inactiveStatus}`}
					>
						{!mounted ? "Checking..." : active ? "Active Now" : "Upcoming"}
					</span>
				</div>
			</div>

			{active && <button className={styles.viewQueueButton}>👁️ View Queue</button>}
		</div>
	);
}
