import { useQuery } from '@tanstack/react-query';
import { MenuService, MenuItem } from '../services/MenuService';

export function useMenuItems(mealType: string | null) {
    return useQuery({
        queryKey: ['menu', mealType],
        queryFn: () => MenuService.getMenuItems(mealType!),
        enabled: !!mealType,
        staleTime: 5 * 60 * 1000,
    });
}
