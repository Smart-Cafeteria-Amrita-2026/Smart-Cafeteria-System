"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Search,
	Users,
	ChevronLeft,
	ChevronRight,
	ShieldBan,
	ShieldCheck,
	UserCog,
	Eye,
	UserPlus,
	ArrowLeft,
} from "lucide-react";
import { useUserList } from "@/hooks/admin/useAdmin";
import type { UserListFilters } from "@/types/admin.types";

export default function UserManagementPage() {
	const [filters, setFilters] = useState<UserListFilters>({
		page: 1,
		limit: 15,
		role: "",
		account_status: "",
		search: "",
	});

	const [searchInput, setSearchInput] = useState("");
	const { data, isLoading } = useUserList(filters);

	const handleSearch = () => {
		setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSearch();
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
			{/* Header */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="flex items-center gap-3">
						<Link
							href="/admin"
							className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30 transition"
						>
							<ArrowLeft size={20} />
						</Link>
						<div>
							<h1 className="text-2xl font-bold text-white sm:text-3xl">User Management</h1>
							<p className="text-sm text-white/80">Manage all system users</p>
						</div>
					</div>
					<Link
						href="/admin/users/create-staff"
						className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] shadow-lg hover:shadow-xl transition"
					>
						<UserPlus size={18} />
						Create Staff
					</Link>
				</div>
			</div>

			{/* Filters */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
				<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
					<div className="flex flex-wrap gap-3">
						{/* Search */}
						<div className="relative flex-1 min-w-[200px]">
							<Search
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								size={16}
							/>
							<input
								type="text"
								placeholder="Search by name, email, or college ID..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								onKeyDown={handleKeyDown}
								className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition"
							/>
						</div>
						{/* Role Filter */}
						<select
							value={filters.role || ""}
							onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value, page: 1 }))}
							className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
						>
							<option value="">All Roles</option>
							<option value="user">User</option>
							<option value="staff">Staff</option>
							<option value="admin">Admin</option>
						</select>
						{/* Status Filter */}
						<select
							value={filters.account_status || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, account_status: e.target.value, page: 1 }))
							}
							className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
						>
							<option value="">All Statuses</option>
							<option value="active">Active</option>
							<option value="blocked">Blocked</option>
							<option value="deactivated">Deactivated</option>
						</select>
						<button
							onClick={handleSearch}
							className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
						>
							Search
						</button>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
				<div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
					{isLoading ? (
						<div className="p-8 space-y-3">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="animate-pulse h-14 bg-gray-100 rounded-xl" />
							))}
						</div>
					) : data && data.users.length > 0 ? (
						<>
							{/* Desktop Table */}
							<div className="hidden md:block overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b bg-gray-50/70">
											<th className="px-5 py-3.5 text-left font-semibold text-gray-600">User</th>
											<th className="px-5 py-3.5 text-left font-semibold text-gray-600">
												College ID
											</th>
											<th className="px-5 py-3.5 text-left font-semibold text-gray-600">Role</th>
											<th className="px-5 py-3.5 text-left font-semibold text-gray-600">Status</th>
											<th className="px-5 py-3.5 text-left font-semibold text-gray-600">Balance</th>
											<th className="px-5 py-3.5 text-right font-semibold text-gray-600">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y">
										{data.users.map((user) => (
											<tr key={user.id} className="hover:bg-orange-50/50 transition-colors">
												<td className="px-5 py-3.5">
													<div>
														<p className="font-medium text-gray-900">
															{user.first_name} {user.last_name}
														</p>
														<p className="text-xs text-gray-400">{user.email}</p>
													</div>
												</td>
												<td className="px-5 py-3.5 text-gray-600">{user.college_id}</td>
												<td className="px-5 py-3.5">
													<span
														className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
															user.role === "admin"
																? "bg-orange-100 text-orange-700"
																: user.role === "staff"
																	? "bg-purple-100 text-purple-700"
																	: "bg-blue-100 text-blue-700"
														}`}
													>
														{user.role === "admin" ? (
															<Users size={12} />
														) : user.role === "staff" ? (
															<UserCog size={12} />
														) : null}
														{user.role}
													</span>
												</td>
												<td className="px-5 py-3.5">
													<span
														className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
												</td>
												<td className="px-5 py-3.5 font-medium text-gray-700">
													₹{user.wallet_balance.toLocaleString()}
												</td>
												<td className="px-5 py-3.5 text-right">
													<Link
														href={`/admin/users/${user.id}`}
														className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100 transition"
													>
														<Eye size={14} />
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Mobile Cards */}
							<div className="md:hidden p-3 space-y-3">
								{data.users.map((user) => (
									<Link
										key={user.id}
										href={`/admin/users/${user.id}`}
										className="block rounded-xl border border-gray-100 p-4 hover:bg-orange-50/50 transition"
									>
										<div className="flex items-center justify-between mb-2">
											<p className="font-semibold text-gray-900">
												{user.first_name} {user.last_name}
											</p>
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
													user.role === "admin"
														? "bg-orange-100 text-orange-700"
														: user.role === "staff"
															? "bg-purple-100 text-purple-700"
															: "bg-blue-100 text-blue-700"
												}`}
											>
												{user.role}
											</span>
										</div>
										<p className="text-xs text-gray-400 mb-1">{user.email}</p>
										<div className="flex items-center gap-3 text-xs text-gray-500">
											<span>{user.college_id}</span>
											<span
												className={`font-semibold ${
													user.account_status === "active"
														? "text-green-600"
														: user.account_status === "blocked"
															? "text-red-600"
															: "text-gray-500"
												}`}
											>
												{user.account_status}
											</span>
											<span className="ml-auto font-medium text-gray-700">
												₹{user.wallet_balance}
											</span>
										</div>
									</Link>
								))}
							</div>

							{/* Pagination */}
							{data.totalPages > 1 && (
								<div className="flex items-center justify-between border-t px-5 py-3">
									<p className="text-sm text-gray-500">
										Page {data.page} of {data.totalPages} ({data.total} users)
									</p>
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
											}
											disabled={data.page <= 1}
											className="rounded-lg border p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
										>
											<ChevronLeft size={16} />
										</button>
										<button
											onClick={() =>
												setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
											}
											disabled={data.page >= data.totalPages}
											className="rounded-lg border p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
										>
											<ChevronRight size={16} />
										</button>
									</div>
								</div>
							)}
						</>
					) : (
						<div className="flex flex-col items-center justify-center p-12 text-center">
							<Users className="text-gray-300 mb-3" size={48} />
							<p className="text-lg font-medium text-gray-500">No users found</p>
							<p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
