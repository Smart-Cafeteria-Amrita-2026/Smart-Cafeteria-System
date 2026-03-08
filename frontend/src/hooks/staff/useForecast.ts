import { useQuery } from "@tanstack/react-query";
import { ForecastService } from "@/services/staff/ForecastService";
import type { TrendingItemsResponse } from "@/types/staff/forecast.types";

export function useTrendingItems() {
	return useQuery<TrendingItemsResponse>({
		queryKey: ["forecast", "trending-items"],
		queryFn: ForecastService.getTrendingItems,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});
}
