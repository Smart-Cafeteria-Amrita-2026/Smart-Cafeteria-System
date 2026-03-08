"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	useIngredients,
	useAddIngredient,
	useUpdateIngredient,
	useDeleteIngredient,
	useUpdateInventory,
} from "@/hooks/staff/useInventory";
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
	X,
	Loader2,
	Pencil,
	Trash2,
} from "lucide-react";

/* ---------------- HELPERS ---------------- */

const getStockStatus = (current: number, threshold: number) => {
	if (current === 0)
		return { status: "out_of_stock", label: "Out of Stock", color: "text-red-600 bg-red-50" };

	if (current <= threshold)
		return { status: "low_stock", label: "Low Stock", color: "text-amber-600 bg-amber-50" };

	return { status: "in_stock", label: "In Stock", color: "text-emerald-600 bg-emerald-50" };
};

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

/* ---------------- RESTOCK MODAL ---------------- */

interface RestockModalProps {
	ingredient: Ingredient;
	onClose: () => void;
	onSubmit: (quantity: number) => void;
	onEdit: () => void;
	onDelete: () => void;
	isPending: boolean;
}

function RestockModal({
	ingredient,
	onClose,
	onSubmit,
	onEdit,
	onDelete,
	isPending,
}: RestockModalProps) {
	const [quantity, setQuantity] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const qty = parseFloat(quantity);
		if (qty > 0) {
			onSubmit(qty);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Restock Ingredient</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<div className="mb-4 p-4 bg-gray-50 rounded-xl">
					<p className="text-sm text-gray-500">Ingredient</p>
					<p className="font-semibold text-gray-900 text-lg">{ingredient.ingredient_name}</p>
					<p className="text-sm text-gray-500 mt-1">
						Current stock:{" "}
						<span className="font-medium text-gray-700">
							{ingredient.current_quantity} {ingredient.unit_of_measurement}
						</span>
					</p>
				</div>

				<form onSubmit={handleSubmit}>
					<label
						htmlFor="restock-quantity"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Restock Quantity ({ingredient.unit_of_measurement})
					</label>
					<input
						id="restock-quantity"
						type="number"
						min="0.01"
						step="any"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						placeholder={`Enter quantity in ${ingredient.unit_of_measurement}`}
						className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all text-lg"
						required
					/>

					<div className="flex gap-3 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending || !quantity || parseFloat(quantity) <= 0}
							className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									Restocking...
								</>
							) : (
								<>
									<RefreshCw size={18} />
									Restock
								</>
							)}
						</button>
					</div>
				</form>

				{/* Edit & Delete actions */}
				<div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
					<button
						type="button"
						onClick={onEdit}
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
					>
						<Pencil size={16} />
						Edit Ingredient
					</button>
					<button
						type="button"
						onClick={onDelete}
						className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
					>
						<Trash2 size={16} />
						Delete Ingredient
					</button>
				</div>
			</div>
		</div>
	);
}

/* ---------------- ADD INGREDIENT MODAL ---------------- */

interface AddIngredientModalProps {
	onClose: () => void;
	onSubmit: (data: {
		ingredient_name: string;
		unit_of_measurement: string;
		current_quantity: number;
		minimum_threshold: number;
		unit_cost?: number;
	}) => void;
	isPending: boolean;
}

function AddIngredientModal({ onClose, onSubmit, isPending }: AddIngredientModalProps) {
	const [name, setName] = useState("");
	const [unit, setUnit] = useState("");
	const [quantity, setQuantity] = useState("");
	const [threshold, setThreshold] = useState("");
	const [unitCost, setUnitCost] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			ingredient_name: name.trim(),
			unit_of_measurement: unit.trim(),
			current_quantity: parseFloat(quantity),
			minimum_threshold: parseFloat(threshold),
			unit_cost: unitCost ? parseFloat(unitCost) : undefined,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Add New Ingredient</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div>
						<label
							htmlFor="add-ingredient-name"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Ingredient Name <span className="text-red-500">*</span>
						</label>
						<input
							id="add-ingredient-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Rice (Basmati)"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Unit of measurement */}
					<div>
						<label
							htmlFor="add-ingredient-unit"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Unit of Measurement <span className="text-red-500">*</span>
						</label>
						<input
							id="add-ingredient-unit"
							type="text"
							value={unit}
							onChange={(e) => setUnit(e.target.value)}
							placeholder="e.g. kg, L, pcs"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Quantity */}
					<div>
						<label
							htmlFor="add-ingredient-quantity"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Initial Quantity <span className="text-red-500">*</span>
						</label>
						<input
							id="add-ingredient-quantity"
							type="number"
							min="0"
							step="any"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							placeholder="e.g. 100"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Min threshold */}
					<div>
						<label
							htmlFor="add-ingredient-threshold"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Minimum Threshold <span className="text-red-500">*</span>
						</label>
						<input
							id="add-ingredient-threshold"
							type="number"
							min="0"
							step="any"
							value={threshold}
							onChange={(e) => setThreshold(e.target.value)}
							placeholder="e.g. 20"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Unit cost */}
					<div>
						<label
							htmlFor="add-ingredient-cost"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Unit Cost (₹)
						</label>
						<input
							id="add-ingredient-cost"
							type="number"
							min="0"
							step="any"
							value={unitCost}
							onChange={(e) => setUnitCost(e.target.value)}
							placeholder="e.g. 65"
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending || !name || !unit || !quantity || !threshold}
							className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									Adding...
								</>
							) : (
								<>
									<Plus size={18} />
									Add Ingredient
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

/* ---------------- EDIT INGREDIENT MODAL ---------------- */

interface EditIngredientModalProps {
	ingredient: Ingredient;
	onClose: () => void;
	onSubmit: (data: {
		ingredient_name: string;
		unit_of_measurement: string;
		minimum_threshold: number;
		unit_cost?: number;
	}) => void;
	isPending: boolean;
}

function EditIngredientModal({
	ingredient,
	onClose,
	onSubmit,
	isPending,
}: EditIngredientModalProps) {
	const [name, setName] = useState(ingredient.ingredient_name);
	const [unit, setUnit] = useState(ingredient.unit_of_measurement);
	const [threshold, setThreshold] = useState(String(ingredient.minimum_threshold));
	const [unitCost, setUnitCost] = useState(
		ingredient.unit_cost ? String(ingredient.unit_cost) : ""
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			ingredient_name: name.trim(),
			unit_of_measurement: unit.trim(),
			minimum_threshold: parseFloat(threshold),
			unit_cost: unitCost ? parseFloat(unitCost) : undefined,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Edit Ingredient</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div>
						<label
							htmlFor="edit-ingredient-name"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Ingredient Name <span className="text-red-500">*</span>
						</label>
						<input
							id="edit-ingredient-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Unit */}
					<div>
						<label
							htmlFor="edit-ingredient-unit"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Unit of Measurement <span className="text-red-500">*</span>
						</label>
						<input
							id="edit-ingredient-unit"
							type="text"
							value={unit}
							onChange={(e) => setUnit(e.target.value)}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Threshold */}
					<div>
						<label
							htmlFor="edit-ingredient-threshold"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Minimum Threshold <span className="text-red-500">*</span>
						</label>
						<input
							id="edit-ingredient-threshold"
							type="number"
							min="0"
							step="any"
							value={threshold}
							onChange={(e) => setThreshold(e.target.value)}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
							required
						/>
					</div>

					{/* Unit cost */}
					<div>
						<label
							htmlFor="edit-ingredient-cost"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							Unit Cost (₹)
						</label>
						<input
							id="edit-ingredient-cost"
							type="number"
							min="0"
							step="any"
							value={unitCost}
							onChange={(e) => setUnitCost(e.target.value)}
							className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
					</div>

					{/* Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending || !name || !unit || !threshold}
							className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Pencil size={18} />
									Save Changes
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

/* ---------------- DELETE CONFIRM MODAL ---------------- */

interface DeleteConfirmModalProps {
	ingredient: Ingredient;
	onClose: () => void;
	onConfirm: () => void;
	isPending: boolean;
}

function DeleteConfirmModal({
	ingredient,
	onClose,
	onConfirm,
	isPending,
}: DeleteConfirmModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-gray-900">Delete Ingredient</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} className="text-gray-500" />
					</button>
				</div>

				<p className="text-gray-600 mb-2">
					Are you sure you want to delete{" "}
					<span className="font-semibold text-gray-900">{ingredient.ingredient_name}</span>?
				</p>
				<p className="text-sm text-red-500 mb-6">This action cannot be undone.</p>

				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={isPending}
						className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isPending ? (
							<>
								<Loader2 size={18} className="animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 size={18} />
								Delete
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

/* ---------------- INVENTORY ROW ---------------- */

interface InventoryRowProps {
	ingredient: Ingredient;
	onRestock: (ingredient: Ingredient) => void;
}

function InventoryRow({ ingredient, onRestock }: InventoryRowProps) {
	const stockStatus = getStockStatus(ingredient.current_quantity, ingredient.minimum_threshold);

	return (
		<tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
			<td className="px-4 py-4 sm:px-6">
				<div className="flex items-center gap-3">
					<div className="hidden sm:flex w-10 h-10 rounded-lg bg-[var(--primary)] items-center justify-center text-white font-bold text-sm">
						{ingredient.ingredient_name.charAt(0)}
					</div>
					<p className="font-semibold text-gray-900">{ingredient.ingredient_name}</p>
				</div>
			</td>

			<td className="px-4 py-4 sm:px-6">
				<div className="flex gap-1 items-baseline">
					<span className="font-bold text-lg text-gray-900">{ingredient.current_quantity}</span>
					<span className="text-sm text-gray-500">{ingredient.unit_of_measurement}</span>
				</div>
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
					onClick={() => onRestock(ingredient)}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
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
	const [restockTarget, setRestockTarget] = useState<Ingredient | null>(null);
	const [editTarget, setEditTarget] = useState<Ingredient | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Ingredient | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);

	const { data, isLoading } = useIngredients(searchQuery, showLowStockOnly);
	const addIngredientMutation = useAddIngredient();
	const updateIngredientMutation = useUpdateIngredient();
	const deleteIngredientMutation = useDeleteIngredient();
	const updateInventoryMutation = useUpdateInventory();

	const ingredients: Ingredient[] = data?.data ?? [];

	const stats = useMemo(() => {
		const total = ingredients.length;
		const outOfStock = ingredients.filter((i) => i.current_quantity === 0).length;
		const lowStock = ingredients.filter(
			(i) => i.current_quantity > 0 && i.current_quantity <= i.minimum_threshold
		).length;
		const inStock = total - outOfStock - lowStock;
		return { total, outOfStock, lowStock, inStock };
	}, [ingredients]);

	const handleRestock = (quantity: number) => {
		if (!restockTarget) return;
		updateInventoryMutation.mutate(
			{
				ingredient_id: restockTarget.ingredient_id,
				update_type: "restock",
				quantity_change: quantity,
			},
			{
				onSuccess: () => setRestockTarget(null),
			}
		);
	};

	const handleAddIngredient = (formData: {
		ingredient_name: string;
		unit_of_measurement: string;
		current_quantity: number;
		minimum_threshold: number;
		unit_cost?: number;
	}) => {
		addIngredientMutation.mutate(formData, {
			onSuccess: () => setShowAddModal(false),
		});
	};

	const handleEditIngredient = (formData: {
		ingredient_name: string;
		unit_of_measurement: string;
		minimum_threshold: number;
		unit_cost?: number;
	}) => {
		if (!editTarget) return;
		updateIngredientMutation.mutate(
			{ id: editTarget.ingredient_id, payload: formData },
			{ onSuccess: () => setEditTarget(null) }
		);
	};

	const handleDeleteIngredient = () => {
		if (!deleteTarget) return;
		deleteIngredientMutation.mutate(deleteTarget.ingredient_id, {
			onSuccess: () => setDeleteTarget(null),
		});
	};

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
					<div className="relative flex-1">
						<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search ingredients..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
						/>
					</div>

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

					<button
						onClick={() => setShowAddModal(true)}
						className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors shadow-lg shadow-[var(--primary)]/25 shrink-0"
					>
						<Plus size={18} />
						<span className="hidden sm:inline">Add Ingredient</span>
						<span className="sm:hidden">Add</span>
					</button>
				</div>

				{/* TABLE */}
				<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[500px]">
							<thead>
								<tr className="bg-gray-50 border-b border-gray-100">
									<th className="px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											Ingredient
										</span>
									</th>
									<th className="px-4 py-3 sm:px-6 text-left">
										<span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
											In Stock
										</span>
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
								{isLoading ? (
									<tr>
										<td colSpan={4} className="px-6 py-12 text-center">
											<Loader2
												size={28}
												className="animate-spin text-[var(--primary)] mx-auto mb-2"
											/>
											<p className="text-gray-500">Loading ingredients...</p>
										</td>
									</tr>
								) : ingredients.length === 0 ? (
									<tr>
										<td colSpan={4} className="px-6 py-12 text-center">
											<Package size={40} className="text-gray-300 mx-auto mb-3" />
											<p className="text-gray-500 font-medium">No ingredients found</p>
											<p className="text-gray-400 text-sm mt-1">
												{searchQuery
													? "Try adjusting your search"
													: "Add your first ingredient to get started"}
											</p>
										</td>
									</tr>
								) : (
									ingredients.map((ingredient) => (
										<InventoryRow
											key={ingredient.ingredient_id}
											ingredient={ingredient}
											onRestock={(ing) => setRestockTarget(ing)}
										/>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* TABLE FOOTER */}
					<div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
						<p className="text-sm text-gray-500">Showing {ingredients.length} items</p>
					</div>
				</div>
			</div>

			{/* RESTOCK MODAL */}
			{restockTarget && (
				<RestockModal
					ingredient={restockTarget}
					onClose={() => setRestockTarget(null)}
					onSubmit={handleRestock}
					onEdit={() => {
						setEditTarget(restockTarget);
						setRestockTarget(null);
					}}
					onDelete={() => {
						setDeleteTarget(restockTarget);
						setRestockTarget(null);
					}}
					isPending={updateInventoryMutation.isPending}
				/>
			)}

			{/* ADD INGREDIENT MODAL */}
			{showAddModal && (
				<AddIngredientModal
					onClose={() => setShowAddModal(false)}
					onSubmit={handleAddIngredient}
					isPending={addIngredientMutation.isPending}
				/>
			)}

			{/* EDIT INGREDIENT MODAL */}
			{editTarget && (
				<EditIngredientModal
					ingredient={editTarget}
					onClose={() => setEditTarget(null)}
					onSubmit={handleEditIngredient}
					isPending={updateIngredientMutation.isPending}
				/>
			)}

			{/* DELETE CONFIRM MODAL */}
			{deleteTarget && (
				<DeleteConfirmModal
					ingredient={deleteTarget}
					onClose={() => setDeleteTarget(null)}
					onConfirm={handleDeleteIngredient}
					isPending={deleteIngredientMutation.isPending}
				/>
			)}
		</div>
	);
}
