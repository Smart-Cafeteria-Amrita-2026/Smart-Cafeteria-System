"use client";

import { CartList } from "@/components/cart/CartList";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CartPage() {
	const router = useRouter();

	return (
		<div className="mx-auto max-w-xl p-4 space-y-6">
			<header className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={24} />
				</button>
				<h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
			</header>

			<CartList />
		</div>
	);
}
