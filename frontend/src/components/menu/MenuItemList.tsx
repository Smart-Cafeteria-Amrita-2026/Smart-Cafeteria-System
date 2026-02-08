"use client";

import { useMenuItems } from "@/src/hooks/menu/useMenuItems";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemSkeleton } from "./MenuItemSkeleton";
import { useCartStore } from "@/src/stores/cart.store";
import { useBookingStore } from "@/src/stores/booking.store";
import { useRouter } from "next/navigation";
import { ShoppingBag, UtensilsCrossed } from "lucide-react";
import type { MenuItemData } from "@/src/types/booking.types";

export function MenuItemList() {
	const router = useRouter();
	const { mealType, slotId } = useBookingStore();
	const { data: items, isLoading, isError } = useMenuItems(slotId);
	const { items: cartItems, addItem, incrementItem, decrementItem } = useCartStore();

	if (isError) {
		return (
			<div className="p-8 text-center text-red-500 rounded-xl bg-red-50 border border-red-100">
				Failed to load menu. Please try again later.
			</div>
		);
	}

	const getItemQuantity = (id: number) => {
		return cartItems.find((i) => i.id === id)?.quantity || 0;
	};

	const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
	const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

	// Filter available items
	const availableItems = items?.filter((item) => item.is_available && item.is_slot_available) ?? [];

	const handleAddItem = (item: MenuItemData) => {
		const cartItem = {
			id: item.menu_item_id,
			name: item.item_name.replace(/-/g, " "),
			price: item.price,
			image: item.image_url,
			quantity: 1,
		};
		addItem(cartItem);
	};

	return (
		<div className="space-y-6 pb-32">
			{/* Category Header */}
			<div className="flex items-center gap-2 text-gray-500">
				<UtensilsCrossed size={16} />
				<span className="text-sm">{availableItems?.length || 0} items available</span>
			</div>

			<div className="grid grid-cols-1 gap-4">
				{isLoading ? (
					Array.from({ length: 5 }).map((_, i) => <MenuItemSkeleton key={i} />)
				) : availableItems.length === 0 ? (
					<div className="p-8 text-center text-gray-500 rounded-xl bg-gray-50 border border-gray-100">
						No menu items available for this slot.
					</div>
				) : (
					availableItems.map((item) => (
						<MenuItemCard
							key={item.menu_item_id}
							item={item}
							quantity={getItemQuantity(item.menu_item_id)}
							onIncrement={(id) => {
								const exists = cartItems.find((i) => i.id === Number(id));
								if (exists) {
									incrementItem(Number(id));
								} else {
									handleAddItem(item);
								}
							}}
							onDecrement={(id) => decrementItem(Number(id))}
						/>
					))
				)}
			</div>

			{/* Floating Cart Bar */}
			{cartCount > 0 && (
				<div className="fixed bottom-6 left-4 right-4 z-50">
					<button
						onClick={() => router.push("/checkout")}
						className="flex w-full items-center justify-between rounded-2xl bg-blue-600 p-4 text-white shadow-2xl shadow-blue-300 transition-all hover:bg-blue-700 active:scale-[0.98]"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
								<ShoppingBag size={20} />
							</div>
							<div className="text-left">
								<p className="text-xs font-medium text-blue-100">{cartCount} items added</p>
								<p className="font-bold">Review Order</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="text-right">
								<p className="text-xs font-medium text-blue-100">Total</p>
								<p className="text-lg font-black">₹{cartTotal}</p>
							</div>
							<div className="flex items-center pl-3 border-l border-white/20">
								<span className="text-sm font-bold">Next →</span>
							</div>
						</div>
					</button>
				</div>
			)}
		</div>
	);
}
