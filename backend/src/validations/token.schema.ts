import { z } from "zod";
import { TOKEN_STATUS } from "../interfaces/token.types";

// Token ID param schema
export const tokenIdParamSchema = z.object({
	tokenId: z.string().regex(/^\d+$/, "Token ID must be a number"),
});

// Counter ID param schema
export const counterIdParamSchema = z.object({
	counterId: z.string().regex(/^\d+$/, "Counter ID must be a number"),
});

// Slot ID param schema for queue
export const slotIdParamSchema = z.object({
	slotId: z.string().regex(/^\d+$/, "Slot ID must be a number"),
});

// Generate token schema
export const generateTokenSchema = z.object({
	booking_id: z.number().int().positive("Booking ID must be a positive integer"),
});

// Activate token schema
export const activateTokenSchema = z.object({
	token_id: z.number().int().positive("Token ID must be a positive integer"),
});

// Assign counter schema
export const assignCounterSchema = z.object({
	token_id: z.number().int().positive("Token ID must be a positive integer"),
	counter_id: z.number().int().positive("Counter ID must be a positive integer"),
});

// Mark token served schema
export const markTokenServedSchema = z.object({
	token_id: z.number().int().positive("Token ID must be a positive integer"),
});

// Close counter schema (for reassignment)
export const closeCounterSchema = z.object({
	counter_id: z.number().int().positive("Counter ID must be a positive integer"),
	reason: z.string().max(500, "Reason cannot exceed 500 characters").optional(),
});

// Get queue status query schema
export const getQueueStatusSchema = z.object({
	slot_id: z.string().regex(/^\d+$/, "Slot ID must be a number").optional(),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
		.optional(),
});

// Token status filter schema
export const tokenStatusFilterSchema = z.object({
	status: z.enum(TOKEN_STATUS).optional(),
});

// Update counter status schema
export const updateCounterStatusSchema = z.object({
	is_active: z.boolean(),
	reason: z.string().max(500, "Reason cannot exceed 500 characters").optional(),
});

// Get user tokens query schema
export const getUserTokensQuerySchema = z.object({
	status: z.enum(TOKEN_STATUS).optional(),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
		.optional(),
});

// Type exports
export type GenerateTokenInput = z.infer<typeof generateTokenSchema>;
export type ActivateTokenInput = z.infer<typeof activateTokenSchema>;
export type AssignCounterInput = z.infer<typeof assignCounterSchema>;
export type MarkTokenServedInput = z.infer<typeof markTokenServedSchema>;
export type CloseCounterInput = z.infer<typeof closeCounterSchema>;
export type GetQueueStatusInput = z.infer<typeof getQueueStatusSchema>;
export type TokenStatusFilterInput = z.infer<typeof tokenStatusFilterSchema>;
export type UpdateCounterStatusInput = z.infer<typeof updateCounterStatusSchema>;
export type GetUserTokensQueryInput = z.infer<typeof getUserTokensQuerySchema>;
