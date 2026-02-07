import { CartItem } from "@/stores/cart.store";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

interface Props {
	item: CartItem;
	onIncrement: (id: number) => void;
	onDecrement: (id: number) => void;
	onRemove: (id: number) => void;
}

export function CartItemCard({ item, onIncrement, onDecrement, onRemove }: Props) {
	return (
		<div className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
			<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
				<Image src={item.image} alt={item.name} fill className="object-cover" />
			</div>

			<div className="flex flex-1 flex-col gap-1">
				<div className="flex items-start justify-between">
					<div>
						<h3 className="font-bold text-gray-900">{item.name}</h3>
						<p className="text-xs text-gray-500">₹{item.price} per item</p>
					</div>
					<button
						onClick={() => onRemove(item.id)}
						className="text-gray-400 hover:text-red-500 transition-colors"
					>
						<Trash2 size={18} />
					</button>
				</div>

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
