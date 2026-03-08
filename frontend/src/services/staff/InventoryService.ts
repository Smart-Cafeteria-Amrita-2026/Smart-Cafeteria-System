import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

// Ingredient types based on database schema
export interface Ingredient {
	ingredient_id: number;
	ingredient_name: string;
	unit_of_measurement: string;
	current_quantity: number;
	minimum_threshold: number;
	unit_cost: number | null;
	supplier: string | null;
	last_restocked: string | null;
	created_at: string;
	updated_at: string;
}

export interface IngredientsResponse {
	success: boolean;
	data: Ingredient[];
}

export interface IngredientResponse {
	success: boolean;
	data: Ingredient;
}

// Stock alert types
export interface StockAlert {
	alert_id: number;
	ingredient_id: number;
	ingredient_name?: string;
	alert_type: "low_stock" | "out_of_stock" | "expiring_soon";
	current_quantity: number;
	threshold_quantity: number;
	alert_status: "active" | "acknowledged" | "resolved";
	created_at: string;
	acknowledged_at: string | null;
}

export interface StockAlertsResponse {
	success: boolean;
	data: StockAlert[];
}

// Inventory update payload
export interface UpdateInventoryPayload {
	ingredient_id: number;
	update_type: "restock" | "consumption" | "adjustment" | "waste";
	quantity_change: number;
	notes?: string;
}

export interface AddIngredientPayload {
	ingredient_name: string;
	unit_of_measurement: string;
	current_quantity: number;
	minimum_threshold: number;
	unit_cost?: number;
	supplier?: string;
}

// Helper to build query string
function buildQueryString(params: Record<string, string | undefined>): string {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			searchParams.append(key, value);
		}
	});
	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}

export const InventoryService = {
	// Get all ingredients
	getIngredients: (params?: {
		search?: string;
		low_stock_only?: string;
	}): Promise<IngredientsResponse> =>
		apiGet(`/api/inventory/ingredients${buildQueryString(params || {})}`),

	// Get single ingredient
	getIngredient: (id: number): Promise<IngredientResponse> =>
		apiGet(`/api/inventory/ingredients/${id}`),

	// Add new ingredient
	addIngredient: (payload: AddIngredientPayload): Promise<IngredientResponse> =>
		apiPost("/api/inventory/ingredients", payload),

	// Update ingredient
	updateIngredient: (
		id: number,
		payload: Partial<AddIngredientPayload>
	): Promise<IngredientResponse> => apiPut(`/api/inventory/ingredients/${id}`, payload),

	// Delete ingredient
	deleteIngredient: (id: number): Promise<{ success: boolean }> =>
		apiDelete(`/api/inventory/ingredients/${id}`),

	// Update inventory (restock, consume, adjust)
	updateInventory: (payload: UpdateInventoryPayload): Promise<{ success: boolean }> =>
		apiPost("/api/inventory/updates", payload),

	// Get stock alerts
	getStockAlerts: (status?: string): Promise<StockAlertsResponse> =>
		apiGet(`/api/inventory/alerts${buildQueryString({ status })}`),

	// Acknowledge alert
	acknowledgeAlert: (alertId: number): Promise<{ success: boolean }> =>
		apiPost(`/api/inventory/alerts/${alertId}/acknowledge`, {}),
};
