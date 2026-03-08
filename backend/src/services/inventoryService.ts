import { service_client } from "../config/supabase";
import type {
	AddIngredientRequest,
	UpdateIngredientRequest,
	UpdateInventoryRequest,
	IngredientResponse,
	InventoryUpdateResponse,
} from "../interfaces/inventory.types";
import { type ServiceResponse, STATUS } from "../interfaces/status.types";

/**
 * Get all ingredients with optional search and low-stock filter
 */
export const getIngredients = async (
	search?: string,
	lowStockOnly?: boolean
): Promise<ServiceResponse<IngredientResponse[]>> => {
	try {
		let query = service_client
			.from("ingredients")
			.select("*")
			.order("ingredient_name", { ascending: true });

		if (search) {
			query = query.ilike("ingredient_name", `%${search}%`);
		}

		const { data, error } = await query;

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		let ingredients = data as IngredientResponse[];

		// Filter low-stock items in application layer (current_quantity <= minimum_threshold)
		if (lowStockOnly) {
			ingredients = ingredients.filter((i) => i.current_quantity <= (i as any).minimum_threshold);
		}

		return {
			success: true,
			data: ingredients,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Get a single ingredient by ID
 */
export const getIngredientById = async (
	ingredientId: number
): Promise<ServiceResponse<IngredientResponse>> => {
	try {
		const { data, error } = await service_client
			.from("ingredients")
			.select("*")
			.eq("ingredient_id", ingredientId)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				return {
					success: false,
					error: "Ingredient not found",
					statusCode: STATUS.NOTFOUND,
				};
			}
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as IngredientResponse,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Add a new ingredient
 */
export const addIngredient = async (
	request: AddIngredientRequest
): Promise<ServiceResponse<IngredientResponse>> => {
	try {
		const { data, error } = await service_client
			.from("ingredients")
			.insert({
				ingredient_name: request.ingredient_name,
				unit_of_measurement: request.unit_of_measurement,
				current_quantity: request.current_quantity,
				minimum_threshold: request.minimum_threshold,
				unit_cost: request.unit_cost ?? null,
				supplier: request.supplier ?? null,
				last_restocked: request.current_quantity > 0 ? new Date().toISOString() : null,
			})
			.select("*")
			.single();

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as IngredientResponse,
			statusCode: STATUS.CREATED,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Update an ingredient's details
 */
export const updateIngredient = async (
	ingredientId: number,
	request: UpdateIngredientRequest
): Promise<ServiceResponse<IngredientResponse>> => {
	try {
		// Verify ingredient exists
		const { data: existing, error: fetchError } = await service_client
			.from("ingredients")
			.select("ingredient_id")
			.eq("ingredient_id", ingredientId)
			.single();

		if (fetchError || !existing) {
			return {
				success: false,
				error: "Ingredient not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const updatePayload: Record<string, unknown> = {
			...request,
			updated_at: new Date().toISOString(),
		};

		const { data, error } = await service_client
			.from("ingredients")
			.update(updatePayload)
			.eq("ingredient_id", ingredientId)
			.select("*")
			.single();

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: data as IngredientResponse,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Delete an ingredient
 */
export const deleteIngredient = async (ingredientId: number): Promise<ServiceResponse<null>> => {
	try {
		// Verify ingredient exists
		const { data: existing, error: fetchError } = await service_client
			.from("ingredients")
			.select("ingredient_id")
			.eq("ingredient_id", ingredientId)
			.single();

		if (fetchError || !existing) {
			return {
				success: false,
				error: "Ingredient not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const { error } = await service_client
			.from("ingredients")
			.delete()
			.eq("ingredient_id", ingredientId);

		if (error) {
			return {
				success: false,
				error: error.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: null,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};

/**
 * Update inventory (restock, consumption, adjustment, waste)
 */
export const updateInventory = async (
	request: UpdateInventoryRequest,
	userId: string
): Promise<ServiceResponse<InventoryUpdateResponse>> => {
	try {
		// Get current ingredient
		const { data: ingredient, error: fetchError } = await service_client
			.from("ingredients")
			.select("ingredient_id, current_quantity")
			.eq("ingredient_id", request.ingredient_id)
			.single();

		if (fetchError || !ingredient) {
			return {
				success: false,
				error: "Ingredient not found",
				statusCode: STATUS.NOTFOUND,
			};
		}

		const previousQuantity = Number(ingredient.current_quantity);
		let newQuantity: number;

		switch (request.update_type) {
			case "restock":
				newQuantity = previousQuantity + request.quantity_change;
				break;
			case "consumption":
			case "waste":
				newQuantity = previousQuantity - request.quantity_change;
				if (newQuantity < 0) {
					return {
						success: false,
						error: "Insufficient stock for this operation",
						statusCode: STATUS.BADREQUEST,
					};
				}
				break;
			case "adjustment":
				newQuantity = request.quantity_change;
				break;
			default:
				return {
					success: false,
					error: "Invalid update type",
					statusCode: STATUS.BADREQUEST,
				};
		}

		// Insert inventory update record
		const { data: updateRecord, error: insertError } = await service_client
			.from("inventory_updates")
			.insert({
				ingredient_id: request.ingredient_id,
				update_type: request.update_type,
				quantity_change: request.quantity_change,
				previous_quantity: previousQuantity,
				new_quantity: newQuantity,
				updated_by: userId,
				notes: request.notes ?? null,
			})
			.select("*")
			.single();

		if (insertError) {
			return {
				success: false,
				error: insertError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		// Update ingredient quantity
		const updatePayload: Record<string, unknown> = {
			current_quantity: newQuantity,
			updated_at: new Date().toISOString(),
		};

		if (request.update_type === "restock") {
			updatePayload.last_restocked = new Date().toISOString();
		}

		const { error: updateError } = await service_client
			.from("ingredients")
			.update(updatePayload)
			.eq("ingredient_id", request.ingredient_id);

		if (updateError) {
			return {
				success: false,
				error: updateError.message,
				statusCode: STATUS.SERVERERROR,
			};
		}

		return {
			success: true,
			data: updateRecord as InventoryUpdateResponse,
			statusCode: STATUS.SUCCESS,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			statusCode: STATUS.SERVERERROR,
		};
	}
};
