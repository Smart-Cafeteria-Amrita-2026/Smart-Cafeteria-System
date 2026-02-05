import Image from 'next/image';
import { MenuItem } from '../services/MenuService';
import { Plus, Minus } from 'lucide-react';

interface Props {
    item: MenuItem;
    quantity: number;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
}

export function MenuItemCard({ item, quantity, onIncrement, onDecrement }: Props) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col gap-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">₹{item.price}</span>

                    {quantity > 0 ? (
                        <div className="flex items-center gap-3 bg-blue-50 p-1 rounded-lg border border-blue-100">
                            <button
                                onClick={() => onDecrement(item.id)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-4 text-center font-bold text-blue-700">{quantity}</span>
                            <button
                                onClick={() => onIncrement(item.id)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onIncrement(item.id)}
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
