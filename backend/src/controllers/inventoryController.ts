import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import {
	getIngredients,
	getIngredientById,
	addIngredient,
	updateIngredient,
	deleteIngredient,
	updateInventory,
} from "../services/inventoryService";
import {
	addIngredientSchema,
	updateIngredientSchema,
	updateInventorySchema,
} from "../validations/inventory.schema";

/**
 * GET /api/inventory/ingredients
 * Get all ingredients (optional search & low_stock_only filters)
 */
export const getIngredientsController = async (req: Request, res: Response): Promise<void> => {
	try {
		const search = req.query.search as string | undefined;
		const lowStockOnly = req.query.low_stock_only === "true";

		const result = await getIngredients(search, lowStockOnly);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * GET /api/inventory/ingredients/:id
 * Get a single ingredient by ID
 */
export const getIngredientController = async (req: Request, res: Response): Promise<void> => {
	try {
		const ingredientId = parseInt(req.params.id as string, 10);

		if (Number.isNaN(ingredientId)) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid ingredient ID",
			});
			return;
		}

		const result = await getIngredientById(ingredientId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/inventory/ingredients
 * Add a new ingredient
 */
export const addIngredientController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedBody = addIngredientSchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const result = await addIngredient(validatedBody.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Ingredient added successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * PUT /api/inventory/ingredients/:id
 * Update an ingredient's details
 */
export const updateIngredientController = async (req: Request, res: Response): Promise<void> => {
	try {
		const ingredientId = parseInt(req.params.id as string, 10);

		if (Number.isNaN(ingredientId)) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid ingredient ID",
			});
			return;
		}

		const validatedBody = updateIngredientSchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const result = await updateIngredient(ingredientId, validatedBody.data);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Ingredient updated successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * DELETE /api/inventory/ingredients/:id
 * Delete an ingredient
 */
export const deleteIngredientController = async (req: Request, res: Response): Promise<void> => {
	try {
		const ingredientId = parseInt(req.params.id as string, 10);

		if (Number.isNaN(ingredientId)) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: "Invalid ingredient ID",
			});
			return;
		}

		const result = await deleteIngredient(ingredientId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Ingredient deleted successfully",
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * POST /api/inventory/updates
 * Update inventory (restock, consumption, adjustment, waste)
 */
export const updateInventoryController = async (req: Request, res: Response): Promise<void> => {
	try {
		const validatedBody = updateInventorySchema.safeParse(req.body);

		if (!validatedBody.success) {
			res.status(STATUS.BADREQUEST).json({
				success: false,
				error: `Validation Error: ${validatedBody.error.message}`,
			});
			return;
		}

		const userId = req.user?.id;
		if (!userId) {
			res.status(STATUS.UNAUTHORIZED).json({
				success: false,
				error: "User not authenticated",
			});
			return;
		}

		const result = await updateInventory(validatedBody.data, userId);

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			message: "Inventory updated successfully",
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			message: "Internal Server Error",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
