import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminService } from "@/services/admin.service";
import type {
	UserListFilters,
	AuditLogFilters,
	CreateStaffPayload,
	BlockUserPayload,
	UpdateUserRolePayload,
} from "@/types/admin.types";

// ─── Dashboard ─────────────────────────────────────────────

export function useSystemStats() {
	return useQuery({
		queryKey: ["admin", "stats"],
		queryFn: AdminService.getSystemStats,
		staleTime: 30 * 1000,
	});
}

export function useRecentBookings(limit = 10) {
	return useQuery({
		queryKey: ["admin", "recent-bookings", limit],
		queryFn: () => AdminService.getRecentBookings(limit),
		staleTime: 30 * 1000,
	});
}

export function useRevenueSummary(startDate: string, endDate: string) {
	return useQuery({
		queryKey: ["admin", "revenue", startDate, endDate],
		queryFn: () => AdminService.getRevenueSummary(startDate, endDate),
		enabled: !!startDate && !!endDate,
		staleTime: 60 * 1000,
	});
}

// ─── User Management ───────────────────────────────────────

export function useUserList(filters: UserListFilters) {
	return useQuery({
		queryKey: ["admin", "users", filters],
		queryFn: () => AdminService.listUsers(filters),
		staleTime: 15 * 1000,
	});
}

export function useUserDetails(userId: string) {
	return useQuery({
		queryKey: ["admin", "user", userId],
		queryFn: () => AdminService.getUserDetails(userId),
		enabled: !!userId,
	});
}

export function useCreateStaff() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: CreateStaffPayload) => AdminService.createStaff(payload),
		onSuccess: () => {
			toast.success("Staff user created successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create staff user");
		},
	});
}

export function useBlockUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, payload }: { userId: string; payload: BlockUserPayload }) =>
			AdminService.blockUser(userId, payload),
		onSuccess: () => {
			toast.success("User blocked successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to block user");
		},
	});
}

export function useUnblockUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => AdminService.unblockUser(userId),
		onSuccess: () => {
			toast.success("User unblocked successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to unblock user");
		},
	});
}

export function useUpdateUserRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserRolePayload }) =>
			AdminService.updateUserRole(userId, payload),
		onSuccess: () => {
			toast.success("User role updated successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update user role");
		},
	});
}

export function useDeactivateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => AdminService.deactivateUser(userId),
		onSuccess: () => {
			toast.success("User deactivated successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to deactivate user");
		},
	});
}

export function useReactivateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => AdminService.reactivateUser(userId),
		onSuccess: () => {
			toast.success("User reactivated successfully");
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
			queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to reactivate user");
		},
	});
}

// ─── Audit Logs ────────────────────────────────────────────

export function useAuditLogs(filters: AuditLogFilters) {
	return useQuery({
		queryKey: ["admin", "audit-logs", filters],
		queryFn: () => AdminService.getAuditLogs(filters),
		staleTime: 15 * 1000,
	});
}
