import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	InventoryService,
	AddIngredientPayload,
	UpdateInventoryPayload,
	type Ingredient,
} from "@/services/staff/InventoryService";

// Get all ingredients
export function useIngredients(search?: string, lowStockOnly?: boolean) {
	return useQuery({
		queryKey: ["ingredients", search, lowStockOnly],
		queryFn: () =>
			InventoryService.getIngredients({
				search,
				low_stock_only: lowStockOnly ? "true" : undefined,
			}),
		staleTime: 30 * 1000, // 30 seconds
	});
}

// Get single ingredient
export function useIngredient(id: number) {
	return useQuery({
		queryKey: ["ingredient", id],
		queryFn: () => InventoryService.getIngredient(id),
		enabled: !!id,
	});
}

// Get stock alerts
export function useStockAlerts(status?: string) {
	return useQuery({
		queryKey: ["stockAlerts", status],
		queryFn: () => InventoryService.getStockAlerts(status),
		staleTime: 30 * 1000,
	});
}

// Add new ingredient
export function useAddIngredient() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddIngredientPayload) => InventoryService.addIngredient(payload),
		onSuccess: () => {
			toast.success("Ingredient added successfully!");
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
		onError: () => {
			toast.error("Failed to add ingredient.");
		},
	});
}

// Update ingredient details
export function useUpdateIngredient() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: Partial<AddIngredientPayload> }) =>
			InventoryService.updateIngredient(id, payload),
		onSuccess: () => {
			toast.success("Ingredient updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
		},
		onError: () => {
			toast.error("Failed to update ingredient.");
		},
	});
}

// Delete ingredient
export function useDeleteIngredient() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => InventoryService.deleteIngredient(id),
		onSuccess: () => {
			toast.success("Ingredient deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
			queryClient.invalidateQueries({ queryKey: ["stockAlerts"] });
		},
		onError: () => {
			toast.error("Failed to delete ingredient.");
		},
	});
}

// Update inventory (restock, consume, etc.)
export function useUpdateInventory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateInventoryPayload) => InventoryService.updateInventory(payload),
		onSuccess: () => {
			toast.success("Inventory updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["ingredients"] });
			queryClient.invalidateQueries({ queryKey: ["stockAlerts"] });
		},
		onError: () => {
			toast.error("Failed to update inventory.");
		},
	});
}

// Acknowledge stock alert
export function useAcknowledgeAlert() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (alertId: number) => InventoryService.acknowledgeAlert(alertId),
		onSuccess: () => {
			toast.success("Alert acknowledged!");
			queryClient.invalidateQueries({ queryKey: ["stockAlerts"] });
		},
		onError: () => {
			toast.error("Failed to acknowledge alert.");
		},
	});
}
