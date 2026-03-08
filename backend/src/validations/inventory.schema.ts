import { z } from "zod";

// Schema for adding a new ingredient
export const addIngredientSchema = z.object({
	ingredient_name: z
		.string()
		.min(1, "Ingredient name is required")
		.max(200, "Ingredient name cannot exceed 200 characters"),
	unit_of_measurement: z
		.string()
		.min(1, "Unit of measurement is required")
		.max(50, "Unit of measurement cannot exceed 50 characters"),
	current_quantity: z.number().min(0, "Quantity must be non-negative"),
	minimum_threshold: z.number().min(0, "Minimum threshold must be non-negative"),
	unit_cost: z.number().min(0, "Unit cost must be non-negative").optional(),
	supplier: z.string().max(200, "Supplier name cannot exceed 200 characters").optional(),
});

// Schema for updating an ingredient's details
export const updateIngredientSchema = z.object({
	ingredient_name: z
		.string()
		.min(1, "Ingredient name is required")
		.max(200, "Ingredient name cannot exceed 200 characters")
		.optional(),
	unit_of_measurement: z
		.string()
		.min(1, "Unit of measurement is required")
		.max(50, "Unit of measurement cannot exceed 50 characters")
		.optional(),
	current_quantity: z.number().min(0, "Quantity must be non-negative").optional(),
	minimum_threshold: z.number().min(0, "Minimum threshold must be non-negative").optional(),
	unit_cost: z.number().min(0, "Unit cost must be non-negative").nullable().optional(),
	supplier: z.string().max(200, "Supplier name cannot exceed 200 characters").nullable().optional(),
});

// Schema for updating inventory (restock, consumption, etc.)
export const updateInventorySchema = z.object({
	ingredient_id: z.number().int().positive("Ingredient ID must be a positive integer"),
	update_type: z.enum(["restock", "consumption", "adjustment", "waste"], {
		message: "Invalid update type",
	}),
	quantity_change: z.number().positive("Quantity change must be a positive number"),
	notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

// Type exports
export type AddIngredientInput = z.infer<typeof addIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
