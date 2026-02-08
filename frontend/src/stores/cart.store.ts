import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
	id: number;
	name: string;
	price: number;
	image: string;
	quantity: number;
};

type CartState = {
	items: CartItem[];
	addItem: (item: Omit<CartItem, "quantity">) => void;
	incrementItem: (id: number) => void;
	decrementItem: (id: number) => void;
	removeItem: (id: number) => void;
	clearCart: () => void;
	totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (item) =>
				set((state) => {
					const found = state.items.find((i) => i.id === item.id);

					if (found) {
						return {
							items: state.items.map((i) =>
								i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
							),
						};
					}

					return {
						items: [...state.items, { ...item, quantity: 1 }],
					};
				}),

			incrementItem: (id) =>
				set((state) => ({
					items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
				})),

			decrementItem: (id) =>
				set((state) => ({
					items: state.items
						.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
						.filter((i) => i.quantity > 0),
				})),

			removeItem: (id) =>
				set((state) => ({
					items: state.items.filter((i) => i.id !== id),
				})),

			clearCart: () => set({ items: [] }),

			totalAmount: () => {
				return get().items.reduce(
					(total: number, item: CartItem) => total + item.price * item.quantity,
					0
				);
			},
		}),
		{
			name: "cart-store",
		}
	)
);
