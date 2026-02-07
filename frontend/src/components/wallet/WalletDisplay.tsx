import React from "react";
import { Wallet as WalletIcon, Plus, History } from "lucide-react";
import type { WalletTransaction } from "@/types/wallet/wallet.types";

const PRESET_AMOUNTS = [50, 100, 200, 500] as const;
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

interface Props {
	balance: number;
	currency: string;
	onTopUp: (amount: number) => void;
	isTopUpPending?: boolean;
}

export function WalletDisplay({ balance, currency, onTopUp, isTopUpPending }: Props) {
	const [selectedPreset, setSelectedPreset] = React.useState<number | null>(100);
	const [customAmount, setCustomAmount] = React.useState<string>("");
	const [customError, setCustomError] = React.useState<string>("");

	const isCustomMode = selectedPreset === null;
	const effectiveAmount = isCustomMode ? Number(customAmount) || 0 : (selectedPreset ?? 0);

	const handlePresetClick = (amt: number) => {
		setSelectedPreset(amt);
		setCustomAmount("");
		setCustomError("");
	};

	const handleCustomFocus = () => {
		setSelectedPreset(null);
	};

	const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/[^0-9]/g, "");
		setCustomAmount(raw);
		setSelectedPreset(null);

		const num = Number(raw);
		if (raw && num < MIN_AMOUNT) {
			setCustomError(`Minimum amount is ₹${MIN_AMOUNT}`);
		} else if (num > MAX_AMOUNT) {
			setCustomError(`Maximum amount is ₹${MAX_AMOUNT.toLocaleString("en-IN")}`);
		} else {
			setCustomError("");
		}
	};

	const isValid = effectiveAmount >= MIN_AMOUNT && effectiveAmount <= MAX_AMOUNT && !customError;

	return (
		<div className="space-y-6 p-4">
			{/* Balance Card */}
			<div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium opacity-80 uppercase tracking-widest">
						Available Balance
					</span>
					<WalletIcon size={24} className="opacity-80" />
				</div>
				<div className="text-4xl font-black">
					{currency === "INR" ? "₹" : currency}
					{balance.toFixed(2)}
				</div>
			</div>

			{/* Add Money Section */}
			<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
				<div className="flex items-center gap-2">
					<Plus size={20} className="text-blue-600" />
					<span className="font-bold text-gray-800">Add Money to Wallet</span>
				</div>

				{/* Preset amount buttons */}
				<div className="grid grid-cols-4 gap-2">
					{PRESET_AMOUNTS.map((amt) => (
						<button
							key={amt}
							type="button"
							onClick={() => handlePresetClick(amt)}
							className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${
								selectedPreset === amt
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-gray-600 border-gray-100 hover:border-blue-100"
							}`}
						>
							₹{amt}
						</button>
					))}
				</div>

				{/* Custom amount input */}
				<div className="space-y-1">
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
							₹
						</span>
						<input
							type="text"
							inputMode="numeric"
							placeholder="Enter custom amount"
							value={customAmount}
							onChange={handleCustomChange}
							onFocus={handleCustomFocus}
							className={`w-full pl-7 pr-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all outline-none ${
								isCustomMode && customAmount
									? customError
										? "border-red-400 bg-red-50 text-red-700"
										: "border-blue-600 bg-blue-50 text-blue-700"
									: "border-gray-100 bg-white text-gray-700 hover:border-blue-100 focus:border-blue-600 focus:bg-blue-50"
							}`}
						/>
					</div>
					{customError && <p className="text-xs font-medium text-red-500 pl-1">{customError}</p>}
					<p className="text-[11px] text-gray-400 pl-1">
						Min ₹{MIN_AMOUNT} &middot; Max ₹{MAX_AMOUNT.toLocaleString("en-IN")}
					</p>
				</div>

				{/* Top-up button */}
				<button
					disabled={isTopUpPending || !isValid}
					onClick={() => onTopUp(effectiveAmount)}
					className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-xl font-black text-sm uppercase tracking-tight hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isTopUpPending ? "Processing..." : `Top up ₹${effectiveAmount || "–"}`}
				</button>
			</div>
		</div>
	);
}

export function WalletTransactions({ transactions }: { transactions: WalletTransaction[] }) {
	return (
		<div className="divide-y">
			{transactions.length === 0 ? (
				<div className="p-8 text-center text-gray-400 italic text-sm">No transactions yet.</div>
			) : (
				transactions.map((tr) => {
					const isCredit = tr.transaction_type === "recharge" || tr.transaction_type === "refund";
					return (
						<div
							key={tr.id}
							className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
						>
							<div className="flex items-center gap-3">
								<div
									className={`p-2 rounded-lg ${
										isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
									}`}
								>
									<History size={20} />
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900">{tr.description}</p>
									<p className="text-[10px] text-gray-400 font-medium">
										{new Date(tr.created_at).toLocaleDateString()} &bull; {tr.transaction_type}
									</p>
								</div>
							</div>
							<div className={`text-sm font-black ${isCredit ? "text-green-600" : "text-red-600"}`}>
								{isCredit ? "+" : "-"}₹{tr.amount}
							</div>
						</div>
					);
				})
			)}
		</div>
	);
}
