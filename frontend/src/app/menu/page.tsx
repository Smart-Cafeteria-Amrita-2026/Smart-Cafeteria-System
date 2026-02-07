"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { MenuItemList } from "@/src/components/menu/MenuItemList";
import { useBookingStore } from "@/src/stores/booking.store";
import { ArrowLeft } from "lucide-react";

export default function MenuPage() {
	const router = useRouter();
	const { mealType, slotId } = useBookingStore();

	// Protective redirect: Must have a slot to see menu
	if (!slotId) {
		return (
			<div className="p-8 text-center space-y-4">
				<p className="text-gray-600">Please select a time slot first.</p>
				<button
					onClick={() => router.push(`/slots?type=${mealType || "breakfast"}`)}
					className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
				>
					Go back to Slots
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-xl p-4 space-y-6">
			<header className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={24} />
				</button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 capitalize">{mealType} Menu</h1>
					<p className="text-gray-500">Add items to your cart</p>
				</div>
			</header>

			<Suspense
				fallback={<div className="p-8 text-center text-gray-500">Loading delicious food...</div>}
			>
				<MenuItemList />
			</Suspense>
		</div>
	);
}
