// Request Types
export interface AddIngredientRequest {
	ingredient_name: string;
	unit_of_measurement: string;
	current_quantity: number;
	minimum_threshold: number;
	unit_cost?: number;
	supplier?: string;
}

export interface UpdateIngredientRequest {
	ingredient_name?: string;
	unit_of_measurement?: string;
	current_quantity?: number;
	minimum_threshold?: number;
	unit_cost?: number | null;
	supplier?: string | null;
}

export interface UpdateInventoryRequest {
	ingredient_id: number;
	update_type: "restock" | "consumption" | "adjustment" | "waste";
	quantity_change: number;
	notes?: string;
}

// Response Types
export interface IngredientResponse {
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

export interface InventoryUpdateResponse {
	update_id: number;
	ingredient_id: number;
	update_type: string;
	quantity_change: number;
	previous_quantity: number;
	new_quantity: number;
	notes: string | null;
	created_at: string;
}
