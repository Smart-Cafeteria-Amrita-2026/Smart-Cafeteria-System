import { z } from "zod";

export const createStaffSchema = z.object({
	email: z
		.string()
		.email("Valid email is required")
		.refine((email) => email.endsWith("@gmail.com"), {
			message: "Must be a Google mail address (@gmail.com)",
		}),
	first_name: z.string().min(2, "First name is too short"),
	last_name: z.string().min(1, "Last name is too short"),
	college_id: z.string().min(5, "College ID is required"),
	mobile: z
		.string()
		.regex(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits")
		.optional(),
	department: z.string().optional(),
});

export const userListQuerySchema = z.object({
	role: z.enum(["user", "staff", "admin"]).optional(),
	account_status: z.enum(["active", "blocked", "suspended"]).optional(),
	search: z.string().optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const blockUserSchema = z.object({
	reason: z.string().min(5, "Reason must be at least 5 characters"),
	end_date: z.string().datetime({ offset: true }).optional(),
});

export const updateUserRoleSchema = z.object({
	role: z.enum(["user", "staff", "admin"]),
});

export const auditLogQuerySchema = z.object({
	action_type: z.string().optional(),
	target_entity: z.string().optional(),
	admin_id: z.string().uuid().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UserListQueryInput = z.infer<typeof userListQuerySchema>;
export type BlockUserInput = z.infer<typeof blockUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type AuditLogQueryInput = z.infer<typeof auditLogQuerySchema>;
