import { useQuery } from '@tanstack/react-query';
import { SlotService } from '../services/SlotService';
import { MealType } from '../types/booking.types';

export function useSlots(mealType: MealType | null) {
    return useQuery({
        queryKey: ['slots', mealType],
        queryFn: () => SlotService.getSlots(mealType!),
        enabled: !!mealType,
        staleTime: 60 * 1000, // 1 minute
    });
}
