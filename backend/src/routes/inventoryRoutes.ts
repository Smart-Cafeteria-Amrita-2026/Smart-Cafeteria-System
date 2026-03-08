import { Router } from "express";
import {
	getIngredientsController,
	getIngredientController,
	addIngredientController,
	updateIngredientController,
	deleteIngredientController,
	updateInventoryController,
} from "../controllers/inventoryController";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * GET /api/inventory/ingredients
 * Get all ingredients (query params: search, low_stock_only)
 */
router.get("/ingredients", requireAuth, getIngredientsController);

/**
 * GET /api/inventory/ingredients/:id
 * Get a single ingredient by ID
 */
router.get("/ingredients/:id", requireAuth, getIngredientController);

/**
 * POST /api/inventory/ingredients
 * Add a new ingredient
 */
router.post("/ingredients", requireAuth, addIngredientController);

/**
 * PUT /api/inventory/ingredients/:id
 * Update an ingredient's details
 */
router.put("/ingredients/:id", requireAuth, updateIngredientController);

/**
 * DELETE /api/inventory/ingredients/:id
 * Delete an ingredient
 */
router.delete("/ingredients/:id", requireAuth, deleteIngredientController);

/**
 * POST /api/inventory/updates
 * Update inventory (restock, consumption, adjustment, waste)
 */
router.post("/updates", requireAuth, updateInventoryController);

export default router;
