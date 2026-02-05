'use client';

import { useMenuItems } from '../hooks/useMenuItems';
import { MenuItemCard } from './MenuItemCard';
import { MenuItemSkeleton } from './MenuItemSkeleton';
import { useCartStore } from '@/stores/cart.store';
import { useBookingStore } from '@/stores/booking.store';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

export function MenuItemList() {
    const router = useRouter();
    const { mealType } = useBookingStore();
    const { data: items, isLoading, error } = useMenuItems(mealType);
    const { items: cartItems, addItem, incrementItem, decrementItem } = useCartStore();

    if (error) {
        return <div className="p-8 text-center text-red-500">Failed to load menu.</div>;
    }

    const getItemQuantity = (id: string) => {
        return cartItems.find((i) => String(i.id) === id)?.quantity || 0;
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="space-y-6 pb-32">
            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <MenuItemSkeleton key={i} />)
                ) : (
                    items?.map((item) => (
                        <MenuItemCard
                            key={item.id}
                            item={item}
                            quantity={getItemQuantity(item.id)}
                            onIncrement={(id) => {
                                const exists = cartItems.find(i => String(i.id) === id);
                                if (exists) {
                                    incrementItem(Number(id));
                                } else {
                                    addItem({ ...item, id: Number(id) });
                                }
                            }}
                            onDecrement={(id) => decrementItem(Number(id))}
                        />
                    ))
                )}
            </div>

            {/* Floating Cart Bar (Simple) */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 left-4 right-4 z-50">
                    <button
                        onClick={() => router.push('/cart')}
                        className="flex w-full items-center justify-between rounded-2xl bg-blue-600 p-4 text-white shadow-2xl shadow-blue-300 transition-all hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-blue-100">{cartCount} items added</p>
                                <p className="font-bold">Review Order</p>
                            </div>
                        </div>
                        <span className="font-bold">Next →</span>
                    </button>
                </div>
            )}
        </div>
    );
}
