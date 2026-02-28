import { CartItem } from "@/stores/cart.store";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { NUTRITION_DATA } from "@/lib/nutrition.constants";

interface Props {
	item: CartItem;
	onIncrement: (id: number) => void;
	onDecrement: (id: number) => void;
	onRemove: (id: number) => void;
}

export function CartItemCard({ item, onIncrement, onDecrement, onRemove }: Props) {
	// Robust helper to match item names to nutrition data
	const getNutritionInfo = (itemName: string) => {
		if (!itemName) return null;

		// Try direct match first
		if (NUTRITION_DATA[itemName]) return NUTRITION_DATA[itemName];

		// Try normalized: lowercase and replace spaces/underscores with hyphens
		const normalized = itemName
			.toLowerCase()
			.trim()
			.replace(/[\s_]+/g, "-");
		if (NUTRITION_DATA[normalized]) return NUTRITION_DATA[normalized];

		// Case-insensitive search
		const entry = Object.entries(NUTRITION_DATA).find(
			([key]) => key.toLowerCase() === itemName.toLowerCase().trim()
		);
		return entry ? entry[1] : null;
	};

	const nutrition = getNutritionInfo(item.name);

	return (
		<div className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
			{/* Image */}
			<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
				<Image src={item.image} alt={item.name} fill className="object-cover" />
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col gap-1">
				<div className="flex items-start justify-between">
					<div>
						<h3 className="font-bold text-gray-900">{item.name}</h3>
						<p className="text-xs text-gray-500">₹{item.price} per item</p>

						{/* Nutrition Info */}
						{nutrition && (
							<div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-400">
								<span>🔥 {nutrition.calories} kcal</span>
								<span>🥖 {nutrition.carbs}g</span>
								<span>🍗 {nutrition.protein}g</span>
								<span>🥑 {nutrition.fat}g</span>
								<span>🍬 {nutrition.sugar}g</span>
							</div>
						)}
					</div>

					<button
						onClick={() => onRemove(item.id)}
						className="text-gray-400 hover:text-red-500 transition-colors"
					>
						<Trash2 size={18} />
					</button>
				</div>

				{/* Price + Quantity Controls */}
				<div className="mt-2 flex items-center justify-between">
					<span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>

					<div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
						<button
							onClick={() => onDecrement(item.id)}
							className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
						>
							<Minus size={14} />
						</button>

						<span className="w-4 text-center font-bold text-gray-800">{item.quantity}</span>

						<button
							onClick={() => onIncrement(item.id)}
							className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
						>
							<Plus size={14} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
