"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MenuItemList } from "@/components/menu/MenuItemList";
import { useBookingStore } from "@/stores/booking.store";
import { MealType } from "@/types/booking.types";
import { ArrowLeft } from "lucide-react";

type PageProps = {
	params: Promise<{
		category: string;
	}>;
};

function MenuPageContent({ category }: { category: string }) {
	const router = useRouter();
	const { mealType, slotId, members } = useBookingStore();
	const normalizedCategory = category.toLowerCase() as MealType;

	useEffect(() => {
		// Ensure we have a selected slot before showing menu
		if (!slotId) {
			router.push(`/slots?type=${normalizedCategory}`);
		}
	}, [slotId, normalizedCategory, router]);

	if (!slotId) {
		return (
			<div className="flex min-h-screen items-center justify-center p-8">
				<div className="text-center space-y-4">
					<p className="text-gray-600">Please select a slot first</p>
					<button
						onClick={() => router.push(`/slots?type=${normalizedCategory}`)}
						className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
					>
						Select Slot
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl p-4 space-y-6 pb-32">
			<header className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={24} />
				</button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 capitalize">{normalizedCategory} Menu</h1>
					<p className="text-gray-500 text-sm">
						{slotId} • {members} {members === 1 ? "member" : "members"}
					</p>
				</div>
			</header>

			<MenuItemList />
		</div>
	);
}

export default function MenuPage({ params }: PageProps) {
	const resolvedParams = React.use(params);

	return (
		<Suspense fallback={<div className="p-8 text-center text-gray-500">Loading menu...</div>}>
			<MenuPageContent category={resolvedParams.category} />
		</Suspense>
	);
}
