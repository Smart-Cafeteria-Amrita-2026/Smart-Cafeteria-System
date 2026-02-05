import { Slot } from '@/types/booking.types';
import { Users, CheckCircle2 } from 'lucide-react';

interface Props {
    slot: Slot;
    isSelected: boolean;
    isDisabled: boolean;
    onSelect: (id: string) => void;
}

export function SlotCard({ slot, isSelected, isDisabled, onSelect }: Props) {
    const isFull = slot.availableSeats === 0;

    return (
        <button
            onClick={() => !isDisabled && onSelect(slot.id)}
            disabled={isDisabled || isFull}
            className={`relative flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all
                ${isSelected
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                    : 'border-gray-100 bg-white hover:border-blue-200'
                }
                ${(isDisabled || isFull) ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
            `}
        >
            <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                    {slot.startTime} - {slot.endTime}
                </span>
                {isSelected && <CheckCircle2 className="text-blue-600" size={20} />}
            </div>

            <div className="flex items-center gap-2 text-sm">
                <Users size={14} className={isSelected ? 'text-blue-500' : 'text-gray-400'} />
                <span className={isSelected ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                    {slot.availableSeats} / {slot.totalSeats} seats left
                </span>
            </div>

            {isDisabled && !isFull && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
                    Not enough seats
                </p>
            )}
            {isFull && (
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                    Full House
                </p>
            )}
        </button>
    );
}
