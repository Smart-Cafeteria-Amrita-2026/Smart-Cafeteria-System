"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlotList } from "@/src/components/bookings/SlotList";
import { useBookingStore } from "@/src/stores/booking.store";
import { MealType } from "@/src/types/booking.types";
import { ArrowLeft } from "lucide-react";

function SlotsPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { setMealType, mealType } = useBookingStore();

	const typeFromUrl = searchParams.get("type") as MealType;

	useEffect(() => {
		if (typeFromUrl) {
			setMealType(typeFromUrl);
		}
	}, [typeFromUrl, setMealType]);

	if (!mealType && !typeFromUrl) {
		return (
			<div className="p-8 text-center space-y-4">
				<p className="text-gray-600">Please select a meal category first.</p>
				<button
					onClick={() => router.push("/")}
					className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
				>
					Back to Home
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-xl p-4 space-y-8">
			<header className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={24} />
				</button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 capitalize">
						Book your {mealType || typeFromUrl}
					</h1>
					<p className="text-gray-500">Pick a slot and member count</p>
				</div>
			</header>

			<SlotList />
		</div>
	);
}

export default function SlotsPage() {
	return (
		<Suspense
			fallback={<div className="p-8 text-center text-gray-500">Loading booking flow...</div>}
		>
			<SlotsPageContent />
		</Suspense>
	);
}
