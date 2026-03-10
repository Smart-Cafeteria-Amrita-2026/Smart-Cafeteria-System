"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	Mail,
	Phone,
	Building,
	CreditCard,
	Calendar,
	ShieldBan,
	ShieldCheck,
	UserCog,
	UserX,
	UserCheck,
	Ban,
} from "lucide-react";
import {
	useUserDetails,
	useBlockUser,
	useUnblockUser,
	useUpdateUserRole,
	useDeactivateUser,
	useReactivateUser,
} from "@/hooks/admin/useAdmin";

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
	const { userId } = use(params);
	const { data: user, isLoading } = useUserDetails(userId);

	const blockUser = useBlockUser();
	const unblockUser = useUnblockUser();
	const updateRole = useUpdateUserRole();
	const deactivateUser = useDeactivateUser();
	const reactivateUser = useReactivateUser();

	const [blockReason, setBlockReason] = useState("");
	const [showBlockModal, setShowBlockModal] = useState(false);
	const [showRoleModal, setShowRoleModal] = useState(false);
	const [newRole, setNewRole] = useState<"user" | "staff" | "admin">("user");

	if (isLoading) {
		return (
			<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]">
				<div className="container mx-auto px-4 pt-10 sm:px-6 lg:px-8">
					<div className="animate-pulse space-y-4">
						<div className="h-10 w-48 bg-white/20 rounded-xl" />
						<div className="h-64 bg-white/20 rounded-2xl" />
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
				<p className="text-gray-500 text-lg">User not found</p>
			</div>
		);
	}

	const handleBlock = () => {
		if (!blockReason.trim()) return;
		blockUser.mutate(
			{ userId, payload: { reason: blockReason } },
			{
				onSuccess: () => {
					setShowBlockModal(false);
					setBlockReason("");
				},
			}
		);
	};

	const handleRoleUpdate = () => {
		updateRole.mutate(
			{ userId, payload: { role: newRole } },
			{ onSuccess: () => setShowRoleModal(false) }
		);
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
			{/* Header */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<Link
						href="/admin/users"
						className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30 transition"
					>
						<ArrowLeft size={20} />
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-white sm:text-3xl">
							{user.first_name} {user.last_name}
						</h1>
						<p className="text-sm text-white/80">{user.email}</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
				{/* User Info Card */}
				<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div className="flex items-center gap-3">
							<Mail size={18} className="text-gray-400" />
							<div>
								<p className="text-xs text-gray-400">Email</p>
								<p className="font-medium text-gray-900">{user.email}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Phone size={18} className="text-gray-400" />
							<div>
								<p className="text-xs text-gray-400">Mobile</p>
								<p className="font-medium text-gray-900">{user.mobile || "N/A"}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Building size={18} className="text-gray-400" />
							<div>
								<p className="text-xs text-gray-400">Department</p>
								<p className="font-medium text-gray-900">{user.department || "N/A"}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<CreditCard size={18} className="text-gray-400" />
							<div>
								<p className="text-xs text-gray-400">Wallet Balance</p>
								<p className="font-medium text-gray-900">₹{user.wallet_balance.toLocaleString()}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Calendar size={18} className="text-gray-400" />
							<div>
								<p className="text-xs text-gray-400">Joined</p>
								<p className="font-medium text-gray-900">
									{new Date(user.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<UserCog size={18} className="text-gray-400" />
							<div>
								<p className="text-xs text-gray-400">College ID</p>
								<p className="font-medium text-gray-900">{user.college_id}</p>
							</div>
						</div>
					</div>

					{/* Status Badges */}
					<div className="flex flex-wrap gap-2 mt-5 pt-5 border-t">
						<span
							className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
								user.role === "admin"
									? "bg-orange-100 text-orange-700"
									: user.role === "staff"
										? "bg-purple-100 text-purple-700"
										: "bg-blue-100 text-blue-700"
							}`}
						>
							<UserCog size={12} /> Role: {user.role}
						</span>
						<span
							className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
								user.account_status === "active"
									? "bg-green-100 text-green-700"
									: user.account_status === "blocked"
										? "bg-red-100 text-red-700"
										: "bg-gray-100 text-gray-600"
							}`}
						>
							{user.account_status === "blocked" ? (
								<ShieldBan size={12} />
							) : (
								<ShieldCheck size={12} />
							)}
							{user.account_status}
						</span>
						<span
							className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
								user.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
							}`}
						>
							{user.is_active ? "Active Account" : "Deactivated"}
						</span>
					</div>
				</div>

				{/* Actions */}
				<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
					<div className="flex flex-wrap gap-3">
						<button
							onClick={() => {
								setNewRole(user.role as "user" | "staff" | "admin");
								setShowRoleModal(true);
							}}
							className="flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition"
						>
							<UserCog size={16} /> Change Role
						</button>

						{user.account_status === "blocked" ? (
							<button
								onClick={() => unblockUser.mutate(userId)}
								disabled={unblockUser.isPending}
								className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition disabled:opacity-50"
							>
								<ShieldCheck size={16} /> Unblock
							</button>
						) : (
							<button
								onClick={() => setShowBlockModal(true)}
								className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
							>
								<Ban size={16} /> Block User
							</button>
						)}

						{user.is_active ? (
							<button
								onClick={() => deactivateUser.mutate(userId)}
								disabled={deactivateUser.isPending}
								className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
							>
								<UserX size={16} /> Deactivate
							</button>
						) : (
							<button
								onClick={() => reactivateUser.mutate(userId)}
								disabled={reactivateUser.isPending}
								className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition disabled:opacity-50"
							>
								<UserCheck size={16} /> Reactivate
							</button>
						)}
					</div>
				</div>

				{/* Restrictions */}
				{user.restrictions && user.restrictions.length > 0 && (
					<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Restrictions</h3>
						<div className="space-y-3">
							{user.restrictions.map((r) => (
								<div
									key={r.restriction_id}
									className="rounded-xl border border-red-100 bg-red-50/50 p-4"
								>
									<div className="flex items-center justify-between mb-1">
										<span className="text-sm font-semibold text-red-700 capitalize">{r.type}</span>
										<span
											className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
												r.is_active ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
											}`}
										>
											{r.is_active ? "Active" : "Expired"}
										</span>
									</div>
									<p className="text-sm text-gray-600">{r.reason}</p>
									<div className="flex gap-4 mt-2 text-xs text-gray-400">
										<span>From: {new Date(r.start_date).toLocaleDateString()}</span>
										{r.end_date && <span>Until: {new Date(r.end_date).toLocaleDateString()}</span>}
										{r.no_show_count > 0 && <span>No-shows: {r.no_show_count}</span>}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Block Modal */}
			{showBlockModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
						<h3 className="text-lg font-bold text-gray-900 mb-1">Block User</h3>
						<p className="text-sm text-gray-500 mb-4">
							Provide a reason for blocking {user.first_name}
						</p>
						<textarea
							value={blockReason}
							onChange={(e) => setBlockReason(e.target.value)}
							placeholder="Reason for blocking..."
							rows={3}
							className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none resize-none"
						/>
						<div className="flex gap-3 mt-4 justify-end">
							<button
								onClick={() => {
									setShowBlockModal(false);
									setBlockReason("");
								}}
								className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
							>
								Cancel
							</button>
							<button
								onClick={handleBlock}
								disabled={!blockReason.trim() || blockUser.isPending}
								className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
							>
								{blockUser.isPending ? "Blocking..." : "Block User"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Role Modal */}
			{showRoleModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
					<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
						<h3 className="text-lg font-bold text-gray-900 mb-1">Change Role</h3>
						<p className="text-sm text-gray-500 mb-4">Update the role for {user.first_name}</p>
						<select
							value={newRole}
							onChange={(e) => setNewRole(e.target.value as "user" | "staff" | "admin")}
							className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none"
						>
							<option value="user">User</option>
							<option value="staff">Staff</option>
							<option value="admin">Admin</option>
						</select>
						<div className="flex gap-3 mt-4 justify-end">
							<button
								onClick={() => setShowRoleModal(false)}
								className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
							>
								Cancel
							</button>
							<button
								onClick={handleRoleUpdate}
								disabled={updateRole.isPending}
								className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50"
							>
								{updateRole.isPending ? "Updating..." : "Update Role"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
