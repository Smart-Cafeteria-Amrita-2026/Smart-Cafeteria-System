import type { ServiceResponse } from "../interfaces/status.types";
import { STATUS } from "../interfaces/status.types";

const FORECASTER_BASE_URL = process.env.FORECASTER_URL || "http://localhost:8000";

export interface TrendingItem {
	menu_item_id: number;
	item_name: string;
	predicted_demand: number;
	date: string;
}

export interface TrendingItemsResponse {
	trending_items: TrendingItem[];
	message?: string;
}

export const getTrendingItems = async (): Promise<ServiceResponse<TrendingItemsResponse>> => {
	try {
		const response = await fetch(`${FORECASTER_BASE_URL}/api/forecast/trending-items`);

		if (!response.ok) {
			const errorBody = await response.json().catch(() => null);
			return {
				success: false,
				error: errorBody?.detail || `Forecaster responded with status ${response.status}`,
				statusCode: response.status >= 500 ? STATUS.BADGATEWAY : response.status,
			};
		}

		const data: TrendingItemsResponse = await response.json();

		return {
			success: true,
			data,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to reach forecaster service",
			statusCode: STATUS.BADGATEWAY,
		};
	}
};
