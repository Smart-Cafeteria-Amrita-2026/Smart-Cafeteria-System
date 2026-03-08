"use client";

import { useRouter } from "next/navigation";
import { useTrendingItems } from "@/hooks/staff/useForecast";
import type { TrendingItem } from "@/types/staff/forecast.types";
import {
	ArrowLeft,
	BarChart3,
	TrendingUp,
	Utensils,
	Flame,
	CalendarDays,
	RefreshCw,
	AlertTriangle,
} from "lucide-react";

// ─── Dumb Components ────────────────────────────────────────────────

interface TrendingItemCardProps {
	item: TrendingItem;
	rank: number;
}

function TrendingItemCard({ item, rank }: TrendingItemCardProps) {
	const getRankStyle = (r: number) => {
		switch (r) {
			case 1:
				return "from-amber-400 to-orange-500 text-white shadow-orange-200";
			case 2:
				return "from-gray-300 to-gray-400 text-white shadow-gray-200";
			case 3:
				return "from-orange-300 to-amber-400 text-white shadow-amber-200";
			default:
				return "from-gray-100 to-gray-200 text-gray-600 shadow-gray-100";
		}
	};

	return (
		<div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all group">
			{/* Rank Badge */}
			<div
				className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getRankStyle(rank)} flex items-center justify-center font-bold text-lg shrink-0 shadow-sm`}
			>
				{rank}
			</div>

			{/* Item Icon */}
			<div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
				<Utensils size={20} />
			</div>

			{/* Item Info */}
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-gray-900 truncate text-base">{item.item_name}</p>
			</div>

			{/* Predicted Demand */}
			<div className="text-right shrink-0">
				<div className="flex items-center gap-1.5 justify-end">
					<Flame size={16} className="text-orange-500" />
					<span className="text-xl font-bold text-gray-900">
						{Math.round(item.predicted_demand)}
					</span>
				</div>
				<p className="text-xs text-gray-500 mt-0.5">predicted servings</p>
			</div>
		</div>
	);
}

// ─── Skeleton ────────────────────────────────────────────────────────

function TrendingItemCardSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
			<div className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
			<div className="w-11 h-11 rounded-xl bg-gray-200 shrink-0" />
			<div className="flex-1 space-y-2">
				<div className="h-5 bg-gray-200 rounded w-36" />
				<div className="h-4 bg-gray-100 rounded w-16" />
			</div>
			<div className="text-right space-y-2">
				<div className="h-6 bg-gray-200 rounded w-14 ml-auto" />
				<div className="h-3 bg-gray-100 rounded w-24 ml-auto" />
			</div>
		</div>
	);
}

function ForecastSkeleton() {
	return (
		<div className="space-y-3">
			{Array.from({ length: 5 }).map((_, i) => (
				<TrendingItemCardSkeleton key={i} />
			))}
		</div>
	);
}

// ─── Empty State ─────────────────────────────────────────────────────

function EmptyState() {
	return (
		<div className="bg-white rounded-2xl border p-8 sm:p-12 text-center">
			<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
				<TrendingUp size={40} className="text-purple-500" />
			</div>
			<h3 className="text-xl font-bold text-gray-900 mb-2">No Forecast Available</h3>
			<p className="text-gray-500 max-w-md mx-auto">
				There isn&apos;t enough historical booking data yet to generate demand predictions.
				Forecasts will appear once enough orders have been processed.
			</p>
		</div>
	);
}

// ─── Error State ─────────────────────────────────────────────────────

interface ErrorStateProps {
	onRetry: () => void;
}

function ErrorState({ onRetry }: ErrorStateProps) {
	return (
		<div className="bg-white rounded-2xl border p-8 sm:p-12 text-center">
			<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
				<AlertTriangle size={40} className="text-red-400" />
			</div>
			<h3 className="text-xl font-bold text-gray-900 mb-2">Forecast Unavailable</h3>
			<p className="text-gray-500 max-w-md mx-auto mb-6">
				Could not reach the forecasting service. Please ensure the forecaster is running and try
				again.
			</p>
			<button
				onClick={onRetry}
				className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors"
			>
				<RefreshCw size={16} />
				Retry
			</button>
		</div>
	);
}

// ─── Main Page (Smart Component) ────────────────────────────────────

export default function ForecastPage() {
	const router = useRouter();
	const { data, isLoading, isError, refetch } = useTrendingItems();

	const trendingItems = data?.data?.trending_items ?? [];
	const forecastDate = trendingItems[0]?.date ?? new Date().toISOString().split("T")[0];
	const totalPredictedDemand = trendingItems.reduce((sum, item) => sum + item.predicted_demand, 0);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-[var(--primary)] text-[var(--primary-foreground)]">
				<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4 mb-2">
						<button
							onClick={() => router.push("/staff")}
							className="p-2 hover:bg-[var(--primary-foreground)]/10 rounded-full transition-colors"
						>
							<ArrowLeft size={24} />
						</button>
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
								<BarChart3 size={28} className="text-[var(--primary-foreground)]" />
								Demand Forecast
							</h1>
							<p className="text-[var(--primary-foreground)]/80 text-sm sm:text-base">
								Top trending items predicted by AI for today
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-3xl">
				{/* Summary Stats */}
				{!isLoading && !isError && trendingItems.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
						<div className="bg-white rounded-xl border p-4">
							<p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
								<CalendarDays size={14} /> Forecast Date
							</p>
							<p className="text-lg font-bold text-gray-900">{forecastDate}</p>
						</div>
						<div className="bg-white rounded-xl border p-4">
							<p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
								<TrendingUp size={14} /> Total Demand
							</p>
							<p className="text-lg font-bold text-[var(--color-primary)]">
								{Math.round(totalPredictedDemand)} servings
							</p>
						</div>
						<div className="bg-white rounded-xl border p-4 col-span-2 sm:col-span-1">
							<p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
								<Flame size={14} /> Top Items
							</p>
							<p className="text-lg font-bold text-purple-600">{trendingItems.length}</p>
						</div>
					</div>
				)}

				{/* Refresh button */}
				{!isLoading && !isError && trendingItems.length > 0 && (
					<div className="flex justify-end mb-4">
						<button
							onClick={() => refetch()}
							className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
						>
							<RefreshCw size={14} />
							Refresh
						</button>
					</div>
				)}

				{/* Trending Items List */}
				{isLoading ? (
					<ForecastSkeleton />
				) : isError ? (
					<ErrorState onRetry={() => refetch()} />
				) : trendingItems.length === 0 ? (
					<EmptyState />
				) : (
					<div className="space-y-3">
						{trendingItems.map((item, index) => (
							<TrendingItemCard key={item.menu_item_id} item={item} rank={index + 1} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
