"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Users,
	UserCheck,
	ShieldBan,
	UserCog,
	CalendarCheck,
	DollarSign,
	AlertTriangle,
	PackageOpen,
	ClipboardList,
	ExternalLink,
	ArrowRight,
	TrendingUp,
	Shield,
} from "lucide-react";
import { useSystemStats, useRecentBookings, useRevenueSummary } from "@/hooks/admin/useAdmin";

export default function AdminDashboardPage() {
	const { data: stats, isLoading: statsLoading } = useSystemStats();

	// Revenue summary for last 30 days
	const today = new Date();
	const thirtyDaysAgo = new Date(today);
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const [startDate] = useState(thirtyDaysAgo.toISOString().split("T")[0]);
	const [endDate] = useState(today.toISOString().split("T")[0]);

	const { data: revenue } = useRevenueSummary(startDate, endDate);
	const { data: recentBookings, isLoading: bookingsLoading } = useRecentBookings(5);

	const statCards = stats
		? [
				{ label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-500" },
				{ label: "Active Users", value: stats.activeUsers, icon: UserCheck, color: "bg-green-500" },
				{ label: "Blocked Users", value: stats.blockedUsers, icon: ShieldBan, color: "bg-red-500" },
				{ label: "Staff Members", value: stats.staffCount, icon: UserCog, color: "bg-purple-500" },
				{
					label: "Bookings Today",
					value: stats.totalBookingsToday,
					icon: CalendarCheck,
					color: "bg-orange-500",
				},
				{
					label: "Total Revenue",
					value: `₹${stats.totalRevenue.toLocaleString()}`,
					icon: DollarSign,
					color: "bg-emerald-500",
				},
				{
					label: "Low Stock Alerts",
					value: stats.lowStockIngredients,
					icon: PackageOpen,
					color: stats.lowStockIngredients > 0 ? "bg-amber-500" : "bg-gray-400",
				},
				{
					label: "Open Feedback",
					value: stats.openFeedbackIssues,
					icon: AlertTriangle,
					color: stats.openFeedbackIssues > 0 ? "bg-rose-500" : "bg-gray-400",
				},
			]
		: [];

	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
			{/* Hero Section */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 lg:px-8 lg:pt-12 lg:pb-8">
				<div className="flex items-center gap-3 mb-2">
					<Shield className="h-8 w-8 text-white/90 sm:h-10 sm:w-10" />
					<div>
						<h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl xl:text-5xl">
							Admin Dashboard
						</h1>
						<p className="mt-1 text-sm text-white/80 sm:text-base lg:text-lg">
							System overview and management controls
						</p>
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
				{statsLoading ? (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="animate-pulse rounded-2xl bg-white/20 backdrop-blur-sm h-28"
							/>
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
						{statCards.map((card) => (
							<div
								key={card.label}
								className="rounded-2xl bg-white/95 backdrop-blur-sm p-4 shadow-lg hover:shadow-xl transition-shadow"
							>
								<div className="flex items-center gap-3">
									<div className={`${card.color} rounded-xl p-2.5 text-white`}>
										<card.icon size={20} />
									</div>
									<div className="min-w-0">
										<p className="text-xs font-medium text-gray-500 truncate">{card.label}</p>
										<p className="text-xl font-bold text-gray-900 sm:text-2xl">{card.value}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Content Grid: Revenue + Recent Bookings + Quick Actions */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
				<div className="grid gap-4 lg:grid-cols-3">
					{/* Revenue Card */}
					<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-5 shadow-lg">
						<div className="flex items-center gap-2 mb-4">
							<TrendingUp size={18} className="text-emerald-600" />
							<h2 className="text-lg font-semibold text-gray-900">Revenue (30 Days)</h2>
						</div>
						{revenue ? (
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Total Revenue</span>
									<span className="font-bold text-gray-900">
										₹{revenue.totalRevenue.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Total Topups</span>
									<span className="font-bold text-gray-900">
										₹{revenue.totalTopups.toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Total Bookings</span>
									<span className="font-bold text-gray-900">{revenue.totalBookings}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">Avg Order Value</span>
									<span className="font-bold text-gray-900">
										₹{revenue.averageOrderValue.toFixed(2)}
									</span>
								</div>
							</div>
						) : (
							<div className="animate-pulse space-y-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="h-6 bg-gray-100 rounded" />
								))}
							</div>
						)}
					</div>

					{/* Recent Bookings */}
					<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-5 shadow-lg">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<CalendarCheck size={18} className="text-orange-600" />
								<h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
							</div>
						</div>
						{bookingsLoading ? (
							<div className="animate-pulse space-y-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="h-10 bg-gray-100 rounded" />
								))}
							</div>
						) : recentBookings && recentBookings.length > 0 ? (
							<div className="space-y-2">
								{recentBookings.map((booking: Record<string, unknown>, i: number) => {
									const user = booking.users as { first_name?: string; last_name?: string } | null;
									const slot = booking.meal_slots as {
										slot_name?: string;
										slot_date?: string;
									} | null;
									const status = booking.booking_status as string;
									return (
										<div
											key={i}
											className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 text-sm"
										>
											<div className="min-w-0">
												<p className="font-medium text-gray-700 truncate">
													{user?.first_name || "User"} {user?.last_name || ""}
												</p>
												<p className="text-xs text-gray-400">
													{slot?.slot_name || (booking.booking_type as string) || ""}
												</p>
											</div>
											<span
												className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
													status === "confirmed"
														? "bg-green-100 text-green-700"
														: status === "cancelled"
															? "bg-red-100 text-red-700"
															: "bg-gray-100 text-gray-600"
												}`}
											>
												{status}
											</span>
										</div>
									);
								})}
							</div>
						) : (
							<p className="text-sm text-gray-400">No recent bookings</p>
						)}
					</div>

					{/* Quick Actions */}
					<div className="rounded-2xl bg-white/95 backdrop-blur-sm p-5 shadow-lg">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
						<div className="space-y-2">
							<Link
								href="/admin/users"
								className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 hover:bg-orange-100 transition-colors"
							>
								<div className="flex items-center gap-3">
									<Users size={18} />
									User Management
								</div>
								<ArrowRight size={16} />
							</Link>

							<Link
								href="/admin/users/create-staff"
								className="flex items-center justify-between rounded-xl bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
							>
								<div className="flex items-center gap-3">
									<UserCog size={18} />
									Create Staff Account
								</div>
								<ArrowRight size={16} />
							</Link>

							<Link
								href="/admin/audit-logs"
								className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
							>
								<div className="flex items-center gap-3">
									<ClipboardList size={18} />
									Audit Logs
								</div>
								<ArrowRight size={16} />
							</Link>

							{process.env.NEXT_PUBLIC_GRAFANA_URL && (
								<a
									href={process.env.NEXT_PUBLIC_GRAFANA_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
								>
									<div className="flex items-center gap-3">
										<ExternalLink size={18} />
										Grafana Monitoring
									</div>
									<ArrowRight size={16} />
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
