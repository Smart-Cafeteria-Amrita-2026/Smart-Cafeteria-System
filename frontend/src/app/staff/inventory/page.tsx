"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useIngredients } from "@/hooks/staff/useInventory";
import type { Ingredient } from "@/services/staff/InventoryService";
import {
	ArrowLeft,
	Package,
	Search,
	AlertTriangle,
	CheckCircle2,
	XCircle,
	TrendingDown,
	Plus,
	RefreshCw,
	ChevronDown,
	ChevronUp,
} from "lucide-react";

/* ---------------- MOCK DATA (UNCHANGED) ---------------- */

const MOCK_INGREDIENTS: Ingredient[] = [
	{
		ingredient_id: 1,
		ingredient_name: "Rice (Basmati)",
		unit_of_measurement: "kg",
		current_quantity: 150,
		minimum_threshold: 50,
		unit_cost: 65,
		supplier: "Metro Wholesale",
		last_restocked: "2026-02-08T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-08T10:00:00Z",
	},
	{
		ingredient_id: 2,
		ingredient_name: "Cooking Oil",
		unit_of_measurement: "L",
		current_quantity: 25,
		minimum_threshold: 30,
		unit_cost: 120,
		supplier: "Fortune Foods",
		last_restocked: "2026-02-05T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-05T10:00:00Z",
	},
	{
		ingredient_id: 3,
		ingredient_name: "Onions",
		unit_of_measurement: "kg",
		current_quantity: 80,
		minimum_threshold: 40,
		unit_cost: 35,
		supplier: "Local Vendor",
		last_restocked: "2026-02-09T06:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-09T06:00:00Z",
	},
	{
		ingredient_id: 4,
		ingredient_name: "Chicken",
		unit_of_measurement: "kg",
		current_quantity: 5,
		minimum_threshold: 20,
		unit_cost: 180,
		supplier: "Fresh Meat Co.",
		last_restocked: "2026-02-07T08:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-07T08:00:00Z",
	},
	{
		ingredient_id: 5,
		ingredient_name: "Tomatoes",
		unit_of_measurement: "kg",
		current_quantity: 45,
		minimum_threshold: 25,
		unit_cost: 40,
		supplier: "Local Vendor",
		last_restocked: "2026-02-09T06:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-09T06:00:00Z",
	},
	{
		ingredient_id: 6,
		ingredient_name: "Salt",
		unit_of_measurement: "kg",
		current_quantity: 30,
		minimum_threshold: 10,
		unit_cost: 20,
		supplier: "Tata Salt",
		last_restocked: "2026-01-20T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-01-20T10:00:00Z",
	},
	{
		ingredient_id: 7,
		ingredient_name: "Milk",
		unit_of_measurement: "L",
		current_quantity: 0,
		minimum_threshold: 50,
		unit_cost: 55,
		supplier: "Amul Dairy",
		last_restocked: "2026-02-08T06:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-08T06:00:00Z",
	},
	{
		ingredient_id: 8,
		ingredient_name: "Wheat Flour",
		unit_of_measurement: "kg",
		current_quantity: 200,
		minimum_threshold: 75,
		unit_cost: 45,
		supplier: "Aashirvaad",
		last_restocked: "2026-02-06T10:00:00Z",
		created_at: "2026-01-01T00:00:00Z",
		updated_at: "2026-02-06T10:00:00Z",
	},
];

/* ---------------- HELPERS ---------------- */

const getStockStatus = (current: number, threshold: number) => {
	if (current === 0)
		return { status: "out_of_stock", label: "Out of Stock", color: "text-red-600 bg-red-50" };

	if (current <= threshold)
		return { status: "low_stock", label: "Low Stock", color: "text-amber-600 bg-amber-50" };

	return { status: "in_stock", label: "In Stock", color: "text-emerald-600 bg-emerald-50" };
};

const formatDate = (dateString: string | null) => {
	if (!dateString) return "—";
	return new Date(dateString).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

type SortField = "ingredient_name" | "current_quantity" | "last_restocked";
type SortOrder = "asc" | "desc";

/* ---------------- STATS CARD ---------------- */

interface StatsCardProps {
	label: string;
	value: number;
	icon: React.ReactNode;
}

function StatsCard({ label, value, icon }: StatsCardProps) {
	return (
		<div className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 shadow-md rounded-2xl p-4 sm:p-5">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-500">{label}</p>
					<p className="text-3xl font-bold text-gray-900">{value}</p>
				</div>
				<div className="p-3 rounded-xl bg-orange-100 text-orange-600">{icon}</div>
			</div>
		</div>
	);
}

/* ---------------- INVENTORY ROW ---------------- */

interface InventoryRowProps {
	ingredient: Ingredient;
	onRestock: (id: number) => void;
}

function InventoryRow({ ingredient, onRestock }: InventoryRowProps) {
	const stockStatus = getStockStatus(ingredient.current_quantity, ingredient.minimum_threshold);

	const stockPercent = Math.min(
		(ingredient.current_quantity / ingredient.minimum_threshold) * 100,
		200
	);

	return (
		<tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
			<td className="px-4 py-4 sm:px-6">
				<div className="flex items-center gap-3">
					<div className="hidden sm:flex w-10 h-10 rounded-lg bg-[var(--primary)] items-center justify-center text-white font-bold text-sm">
						{ingredient.ingredient_name.charAt(0)}
					</div>

					<div>
						<p className="font-semibold text-gray-900">{ingredient.ingredient_name}</p>
						<p className="text-sm text-gray-500">{ingredient.supplier}</p>
					</div>
				</div>
			</td>

			<td className="px-4 py-4 sm:px-6">
				<div className="space-y-1">
					<div className="flex gap-1 items-baseline">
						<span className="font-bold text-lg text-gray-900">{ingredient.current_quantity}</span>
						<span className="text-sm text-gray-500">{ingredient.unit_of_measurement}</span>
					</div>

					<div className="w-full max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full ${
								stockPercent < 50
									? "bg-red-500"
									: stockPercent < 100
										? "bg-amber-500"
										: "bg-emerald-500"
							}`}
							style={{ width: `${Math.min(stockPercent, 100)}%` }}
						/>
					</div>
				</div>
			</td>

			<td className="hidden md:table-cell px-4 py-4 sm:px-6 text-gray-600">
				{ingredient.minimum_threshold} {ingredient.unit_of_measurement}
			</td>

			<td className="hidden lg:table-cell px-4 py-4 sm:px-6 text-gray-900 font-medium">
				₹{ingredient.unit_cost}
			</td>

			<td className="hidden xl:table-cell px-4 py-4 sm:px-6 text-gray-600 text-sm">
				{formatDate(ingredient.last_restocked)}
			</td>

			<td className="px-4 py-4 sm:px-6">
				<span
					className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}
				>
					{stockStatus.label}
				</span>
			</td>

			<td className="px-4 py-4 sm:px-6">
				<button
					onClick={() => onRestock(ingredient.ingredient_id)}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary)] transition-colors"
				>
					<RefreshCw size={14} />
					Restock
				</button>
			</td>
		</tr>
	);
}

/* ---------------- MAIN PAGE ---------------- */

export default function InventoryPage() {
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState("");
	const [showLowStockOnly, setShowLowStockOnly] = useState(false);
	const [sortField, setSortField] = useState<SortField>("ingredient_name");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

	const { data } = useIngredients(searchQuery, showLowStockOnly);

	const ingredients = data?.data || MOCK_INGREDIENTS;

	const stats = useMemo(() => {
		const total = ingredients.length;
		const outOfStock = ingredients.filter((i) => i.current_quantity === 0).length;
		const lowStock = ingredients.filter(
			(i) => i.current_quantity > 0 && i.current_quantity <= i.minimum_threshold
		).length;

		const inStock = total - outOfStock - lowStock;

		return { total, outOfStock, lowStock, inStock };
	}, [ingredients]);

	return (
		<div className="min-h-screen bg-white">
			{/* HEADER */}
			<div className="bg-[var(--primary)] text-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center gap-4 mb-6">
						<button
							onClick={() => router.push("/staff")}
							className="p-2 hover:bg-white/10 rounded-full"
						>
							<ArrowLeft size={24} />
						</button>

						<div>
							<h1 className="text-3xl font-bold">Inventory Management</h1>
							<p className="opacity-80">Track and manage ingredient stock levels</p>
						</div>
					</div>

					{/* STATS */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						<StatsCard label="Total Items" value={stats.total} icon={<Package size={22} />} />
						<StatsCard label="In Stock" value={stats.inStock} icon={<CheckCircle2 size={22} />} />
						<StatsCard label="Low Stock" value={stats.lowStock} icon={<TrendingDown size={22} />} />
						<StatsCard label="Out of Stock" value={stats.outOfStock} icon={<XCircle size={22} />} />
					</div>
				</div>
			</div>

			{/* CONTENT */}
			<div className="container mx-auto px-4 py-6">
				{/* Search & Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					{/* Search */}
					<div className="relative flex-1">
						<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search ingredients or suppliers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
					</div>

					{/* Low Stock Filter */}
					<button
						onClick={() => setShowLowStockOnly(!showLowStockOnly)}
						className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all shrink-0 ${
							showLowStockOnly
								? "bg-amber-50 border-amber-200 text-amber-700"
								: "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
						}`}
					>
						<AlertTriangle size={18} />
						<span className="hidden sm:inline">Low Stock Only</span>
						<span className="sm:hidden">Low Stock</span>
					</button>

					{/* Add Item Button */}
					<button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 shrink-0">
						<Plus size={18} />
						<span className="hidden sm:inline">Add Ingredient</span>
						<span className="sm:hidden">Add</span>
					</button>
				</div>

				{/* TABLE */}
				<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[600px]">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-100">
									<th className="px-4 py-3 sm:px-6 text-left">
										<button
											onClick={() => setSortField("ingredient_name")}
											className="flex items-center gap-1 font-semibold text-gray-600 text-sm uppercase tracking-wide hover:text-gray-900"
										>
											Ingredient
											{sortField === "ingredient_name" &&
												(sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
										</button>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<button
											onClick={() => setSortField("current_quantity")}
											className="flex items-center gap-1 font-semibold text-gray-600 text-sm uppercase tracking-wide hover:text-gray-900"
										>
											Stock
											{sortField === "current_quantity" &&
												(sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
										</button>
									</th>
									<th className="hidden md:table-cell px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Threshold
										</span>
									</th>
									<th className="hidden lg:table-cell px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Unit Cost
										</span>
									</th>
									<th className="hidden xl:table-cell px-4 py-3 sm:px-6 text-left">
										<button
											onClick={() => setSortField("last_restocked")}
											className="flex items-center gap-1 font-semibold text-gray-600 text-sm uppercase tracking-wide hover:text-gray-900"
										>
											Last Restocked
											{sortField === "last_restocked" &&
												(sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
										</button>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Status
										</span>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Actions
										</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{ingredients.map((ingredient) => (
									<InventoryRow
										key={ingredient.ingredient_id}
										ingredient={ingredient}
										onRestock={(id) => console.log("Restock", id)}
									/>
								))}
							</tbody>
						</table>
					</div>

					{/* TABLE FOOTER */}
					<div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
						<p className="text-sm text-gray-500">Showing {ingredients.length} items</p>
					</div>
				</div>
			</div>
		</div>
	);
}
