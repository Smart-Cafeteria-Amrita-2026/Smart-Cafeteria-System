"use client";

import { useCartStore } from "@/stores/cart.store";
import { CartItemCard } from "./CartItemCard";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function CartList() {
	const router = useRouter();
	const { items, totalAmount, incrementItem, decrementItem, removeItem } = useCartStore();

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 space-y-4">
				<div className="rounded-full bg-gray-50 p-6">
					<ShoppingBag size={48} className="text-gray-300" />
				</div>
				<div className="text-center">
					<h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
					<p className="text-gray-500">Add some delicious meals to get started</p>
				</div>
				<button
					onClick={() => router.push("/")}
					className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200"
				>
					Browse Menu
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{items.map((item) => (
					<CartItemCard
						key={item.id}
						item={item}
						onIncrement={incrementItem}
						onDecrement={decrementItem}
						onRemove={removeItem}
					/>
				))}
			</div>

			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<div className="flex justify-between items-center">
					<span className="text-gray-500 font-medium">Subtotal</span>
					<span className="text-gray-900 font-bold">₹{totalAmount()}</span>
				</div>
				<div className="flex justify-between items-center text-xl font-black">
					<span className="text-gray-900">Total</span>
					<span className="text-blue-600">₹{totalAmount()}</span>
				</div>

				<button
					onClick={() => router.push("/checkout")}
					className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 p-4 font-bold text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
				>
					Proceed to Checkout <ArrowRight size={20} />
				</button>
			</div>
		</div>
	);
}
