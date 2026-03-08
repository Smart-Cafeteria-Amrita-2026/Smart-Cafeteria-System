import { apiGet } from "@/lib/api";
import type { TrendingItemsResponse } from "@/types/staff/forecast.types";

export const ForecastService = {
	/** GET /api/forecast/trending-items — proxied through the Express backend */
	getTrendingItems: (): Promise<TrendingItemsResponse> => apiGet("/api/forecast/trending-items"),
};
