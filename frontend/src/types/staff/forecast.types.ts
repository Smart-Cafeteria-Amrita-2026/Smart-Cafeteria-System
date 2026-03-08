export interface TrendingItem {
	menu_item_id: number;
	item_name: string;
	predicted_demand: number;
	date: string;
}

export interface TrendingItemsData {
	trending_items: TrendingItem[];
	message?: string;
}

export interface TrendingItemsResponse {
	success: boolean;
	data: TrendingItemsData;
}
