"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useAuditLogs } from "@/hooks/admin/useAdmin";
import type { AuditLogFilters } from "@/types/admin.types";

export default function AuditLogsPage() {
	const [filters, setFilters] = useState<AuditLogFilters>({
		page: 1,
		limit: 20,
		action_type: "",
		target_entity: "",
	});

	const { data, isLoading } = useAuditLogs(filters);

	const actionColors: Record<string, string> = {
		CREATE: "bg-green-100 text-green-700",
		UPDATE: "bg-blue-100 text-blue-700",
		BLOCK: "bg-red-100 text-red-700",
		UNBLOCK: "bg-emerald-100 text-emerald-700",
		DEACTIVATE: "bg-gray-100 text-gray-600",
		REACTIVATE: "bg-teal-100 text-teal-700",
		ROLE_CHANGE: "bg-purple-100 text-purple-700",
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
			{/* Header */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<Link
						href="/admin"
						className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30 transition"
					>
						<ArrowLeft size={20} />
					</Link>
					<div className="flex items-center gap-2">
						<ClipboardList className="text-white/90" size={24} />
						<div>
							<h1 className="text-2xl font-bold text-white sm:text-3xl">Audit Logs</h1>
							<p className="text-sm text-white/80">Track all admin actions</p>
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
				<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg">
					<div className="flex flex-wrap gap-3 items-center">
						<Filter size={16} className="text-gray-400" />
						<select
							value={filters.action_type || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, action_type: e.target.value, page: 1 }))
							}
							className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
						>
							<option value="">All Actions</option>
							<option value="CREATE">Create</option>
							<option value="UPDATE">Update</option>
							<option value="BLOCK">Block</option>
							<option value="UNBLOCK">Unblock</option>
							<option value="DEACTIVATE">Deactivate</option>
							<option value="REACTIVATE">Reactivate</option>
							<option value="ROLE_CHANGE">Role Change</option>
						</select>

						<select
							value={filters.target_entity || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, target_entity: e.target.value, page: 1 }))
							}
							className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
						>
							<option value="">All Entities</option>
							<option value="user">User</option>
							<option value="staff">Staff</option>
							<option value="menu_item">Menu Item</option>
							<option value="meal_slot">Meal Slot</option>
						</select>

						<input
							type="date"
							value={filters.start_date || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, start_date: e.target.value, page: 1 }))
							}
							className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
							placeholder="Start date"
						/>

						<input
							type="date"
							value={filters.end_date || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, end_date: e.target.value, page: 1 }))
							}
							className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none"
							placeholder="End date"
						/>
					</div>
				</div>
			</div>

			{/* Logs */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
				<div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
					{isLoading ? (
						<div className="p-6 space-y-3">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
							))}
						</div>
					) : data && data.logs.length > 0 ? (
						<>
							<div className="divide-y">
								{data.logs.map((log) => (
									<div
										key={log.audit_id}
										className="px-5 py-4 hover:bg-orange-50/30 transition-colors"
									>
										<div className="flex items-start justify-between gap-4 flex-wrap">
											<div className="min-w-0 flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<span
														className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
															actionColors[log.action_type] || "bg-gray-100 text-gray-600"
														}`}
													>
														{log.action_type}
													</span>
													<span className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">
														{log.target_entity}
													</span>
												</div>
												<p className="text-sm text-gray-700">
													{log.description || `${log.action_type} on ${log.target_entity}`}
												</p>
												<p className="text-xs text-gray-400 mt-1">
													by {log.admin_name || log.admin_email || log.admin_id}
												</p>
											</div>
											<span className="text-xs text-gray-400 whitespace-nowrap">
												{new Date(log.created_at).toLocaleString()}
											</span>
										</div>
									</div>
								))}
							</div>

							{/* Pagination */}
							{data.totalPages > 1 && (
								<div className="flex items-center justify-between border-t px-5 py-3">
									<p className="text-sm text-gray-500">
										Page {data.page} of {data.totalPages} ({data.total} logs)
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
							<ClipboardList className="text-gray-300 mb-3" size={48} />
							<p className="text-lg font-medium text-gray-500">No audit logs found</p>
							<p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
