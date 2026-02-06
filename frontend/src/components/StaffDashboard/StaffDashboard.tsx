"use client";

import { useState, useEffect } from "react";
import { MEAL_TYPES, SLOT_TIMINGS } from "@/src/lib/constants";
import { MealType } from "@/src/lib/types/staff";
import SlotCard from "../SlotCard/SlotCard";
import TokenQueue from "../TokenQueue/TokenQueue";
import Navbar from "../Navigation/Navbar";
import { useStaffStore } from "@/src/stores/staffStore";
import { useRouter } from "next/navigation";
import styles from "./StaffDashboard.module.css";

export default function StaffDashboard() {
	const [activeMealType, setActiveMealType] = useState<MealType>("BREAKFAST");
	const [mounted, setMounted] = useState(false);
	const { openCreateSlotModal, toggleForecastPanel } = useStaffStore();
	const router = useRouter();

	// Prevent hydration mismatch by waiting for mount
	useEffect(() => {
		setMounted(true);
	}, []);

	const mealTypeButtons = [
		{ id: "BREAKFAST", label: "Breakfast", icon: "🌅" },
		{ id: "LUNCH", label: "Lunch", icon: "🍽️" },
		{ id: "SNACKS", label: "Snacks", icon: "☕" },
		{ id: "DINNER", label: "Dinner", icon: "🌙" },
	];

	const getCurrentSlots = () => {
		return SLOT_TIMINGS[activeMealType] || SLOT_TIMINGS.BREAKFAST;
	};

	const handleWalkInBooking = () => {
		router.push("/staff/walk-in");
	};

	return (
		<div className={styles.container}>
			<Navbar />

			<div className={styles.content}>
				<div className={styles.header}>
					<div>
						<h1 className={styles.title}>Staff Dashboard</h1>
						<p className={styles.subtitle}>Manage meal slots and token queue</p>
					</div>
					<div className={styles.actionButtons}>
						<button
							onClick={toggleForecastPanel}
							className={`${styles.button} ${styles.forecastButton}`}
						>
							📊 Forecasting
						</button>
						<button
							onClick={openCreateSlotModal}
							className={`${styles.button} ${styles.createButton}`}
						>
							➕ Create Meal Slot
						</button>
						<button
							onClick={handleWalkInBooking}
							className={styles.button}
							style={{
								backgroundColor: "hsl(var(--warning))",
								color: "hsl(var(--warning-foreground))",
							}}
						>
							🚶 Walk-in Booking
						</button>
					</div>
				</div>

				<div className={styles.mealTypeTabs}>
					{mealTypeButtons.map((mealType) => (
						<button
							key={mealType.id}
							onClick={() => setActiveMealType(mealType.id as MealType)}
							className={`${styles.mealTypeButton} ${activeMealType === mealType.id ? styles.active : ""}`}
						>
							<span className={styles.mealIcon}>{mealType.icon}</span>
							<span>{mealType.label}</span>
						</button>
					))}
				</div>

				<div className={styles.dateSection}>
					<h2 className={styles.dateTitle}>
						Today's Slots -{" "}
						{mounted
							? new Date().toLocaleDateString("en-US", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})
							: "Loading..."}
					</h2>
				</div>

				<div className={styles.slotsGrid}>
					{getCurrentSlots().map((slot) => (
						<SlotCard
							key={slot.id}
							timing={slot.label}
							mealType={activeMealType}
							startTime={slot.start}
							endTime={slot.end}
							capacity={50}
							// REMOVED Math.random() - let SlotCard handle its own random/mock data
						/>
					))}
				</div>

				{/* Token Queue Management */}
				<div className={styles.tokenQueueSection}>
					<div className={styles.sectionHeader}>
						<h2 className={styles.sectionTitle}>Real-time Queue Management</h2>
						<div className={styles.countersInfo}>
							{["Counter 1", "Counter 2", "Counter 3", "Counter 4"].map((counter) => (
								<span key={counter} className={styles.counterTag}>
									{counter}
								</span>
							))}
						</div>
					</div>
					<TokenQueue />
				</div>

				{/* Quick Stats */}
				<div className={styles.statsGrid}>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>📅</div>
						<div>
							<p className={styles.statLabel}>Total Slots Today</p>
							<p className={styles.statValue}>13</p>
						</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>👥</div>
						<div>
							<p className={styles.statLabel}>Total Bookings</p>
							<p className={styles.statValue}>247</p>
						</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>⏱️</div>
						<div>
							<p className={styles.statLabel}>Active Tokens</p>
							<p className={styles.statValue}>18</p>
						</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statIcon}>🚶</div>
						<div>
							<p className={styles.statLabel}>Walk-in Users</p>
							<p className={styles.statValue}>12</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
