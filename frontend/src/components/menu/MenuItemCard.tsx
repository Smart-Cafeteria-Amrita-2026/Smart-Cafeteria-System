import Image from "next/image";
import type { MenuItemData } from "@/src/types/booking.types";
import { Plus, Minus, Leaf } from "lucide-react";

interface Props {
	item: MenuItemData;
	quantity: number;
	onIncrement: (id: string) => void;
	onDecrement: (id: string) => void;
}

export function MenuItemCard({ item, quantity, onIncrement, onDecrement }: Props) {
	const itemId = item.menu_item_id.toString();
	const isOutOfStock =
		item.available_quantity <= 0 || !item.is_available || !item.is_slot_available;

	return (
		<div
			className={`flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md ${isOutOfStock ? "opacity-60" : ""}`}
		>
			<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50">
				<Image
					src={item.image_url}
					alt={item.item_name}
					fill
					className="object-cover"
					unoptimized
				/>
				{item.is_vegetarian && (
					<div className="absolute top-1 left-1 bg-green-500 text-white p-1 rounded-md">
						<Leaf size={12} />
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-1">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-gray-900 capitalize">
						{item.item_name.replace(/-/g, " ")}
					</h3>
				</div>
				<p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>

				{/* Stock info */}
				<div className="text-[10px] text-gray-400">
					{isOutOfStock ? (
						<span className="text-red-500 font-medium">Out of stock</span>
					) : (
						<span>{item.available_quantity} available</span>
					)}
				</div>

				<div className="mt-1 flex items-center justify-between">
					<span className="text-lg font-bold text-blue-600">₹{item.price}</span>

					{isOutOfStock ? (
						<span className="text-xs text-gray-400 font-medium px-3 py-1.5 bg-gray-100 rounded-lg">
							Unavailable
						</span>
					) : quantity > 0 ? (
						<div className="flex items-center gap-3 bg-blue-50 p-1 rounded-lg border border-blue-100">
							<button
								onClick={() => onDecrement(itemId)}
								className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
							>
								<Minus size={16} />
							</button>
							<span className="w-4 text-center font-bold text-blue-700">{quantity}</span>
							<button
								onClick={() => onIncrement(itemId)}
								disabled={quantity >= item.available_quantity}
								className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Plus size={16} />
							</button>
						</div>
					) : (
						<button
							onClick={() => onIncrement(itemId)}
							className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
						>
							<Plus size={14} /> Add
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
