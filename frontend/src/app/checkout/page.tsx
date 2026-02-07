"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function CheckoutPage() {
	const router = useRouter();
	const { items, totalAmount } = useCartStore();
	const { token } = useAuthStore();

	const [paymentMode, setPaymentMode] = useState<"PAY_LATER" | "GROUP_SPLIT">("PAY_LATER");
	const [rollNumber, setRollNumber] = useState("");
	const [memberRolls, setMemberRolls] = useState<string[]>([]);

	const addMember = () => {
		if (!rollNumber.trim()) return;
		if (memberRolls.includes(rollNumber)) {
			toast.error("Roll number already added");
			return;
		}
		setMemberRolls([...memberRolls, rollNumber.trim()]);
		setRollNumber("");
	};

	const removeMember = (roll: string) => {
		setMemberRolls(memberRolls.filter((r) => r !== roll));
	};

	const handleCheckout = () => {
		if (!token) {
			toast.error("Please login to proceed");
			router.push(`/login?redirect=${encodeURIComponent(`/checkout`)}`);
			return;
		}

		if (paymentMode === "GROUP_SPLIT" && memberRolls.length === 0) {
			toast.error("Please add at least one group member");
			return;
		}

		// In a real implementation: BookingService.createBooking({ items, paymentMode, memberRolls })
		toast.success("Order placed successfully! Redirecting to your bookings...");

		// Clear cart...

		router.push("/profile?tab=bookings");
	};

	return (
		<div className="mx-auto max-w-xl space-y-6 p-4 pb-20">
			{/* Header */}
			<div className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					←
				</button>
				<h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
			</div>

			{/* Order Summary */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<h3 className="text-lg font-bold text-gray-800 border-b pb-2">Order Summary</h3>

				<div className="space-y-3">
					{items.map((item) => (
						<div key={item.id} className="flex justify-between text-sm">
							<span className="text-gray-600">
								{item.name} × {item.quantity}
							</span>
							<span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
						</div>
					))}

					<div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
						<span>Total Amount</span>
						<span className="text-blue-600">₹{totalAmount()}</span>
					</div>
				</div>
			</div>

			{/* Payment Methods */}
			<div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
				<h3 className="text-lg font-bold text-gray-800 border-b pb-2">Select Payment Method</h3>

				<div className="grid gap-3">
					<button
						className={`flex w-full items-center justify-between rounded-xl border-2 p-4 font-bold transition-all active:scale-95 ${
							paymentMode === "PAY_LATER"
								? "border-blue-600 bg-blue-50 text-blue-600"
								: "border-gray-100 bg-white text-gray-500"
						}`}
						onClick={() => setPaymentMode("PAY_LATER")}
					>
						<div className="flex items-center gap-3">
							<span className="text-xl">🕒</span> Pay Later
						</div>
						{paymentMode === "PAY_LATER" && <div className="h-2 w-2 rounded-full bg-blue-600" />}
					</button>

					<button
						className={`flex w-full items-center justify-between rounded-xl border-2 p-4 font-bold transition-all active:scale-95 ${
							paymentMode === "GROUP_SPLIT"
								? "border-blue-600 bg-blue-50 text-blue-600"
								: "border-gray-100 bg-white text-gray-500"
						}`}
						onClick={() => setPaymentMode("GROUP_SPLIT")}
					>
						<div className="flex items-center gap-3">
							<span className="text-xl">👥</span> Group Split
						</div>
						{paymentMode === "GROUP_SPLIT" && <div className="h-2 w-2 rounded-full bg-blue-600" />}
					</button>
				</div>

				{paymentMode === "GROUP_SPLIT" && (
					<div className="space-y-3 border-t pt-4 animate-in slide-in-from-top-2 duration-300">
						<label htmlFor="member-search" className="text-sm font-bold text-gray-700">
							Add Registered Members
						</label>
						<div className="flex gap-2">
							<input
								id="member-search"
								type="text"
								placeholder="Enter Roll Number"
								value={rollNumber}
								onChange={(e) => setRollNumber(e.target.value)}
								className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
							/>
							<button
								onClick={addMember}
								className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-100"
							>
								Add
							</button>
						</div>

						{memberRolls.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-2">
								{memberRolls.map((roll) => (
									<div
										key={roll}
										className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
									>
										<span>{roll}</span>
										<button onClick={() => removeMember(roll)} className="hover:text-red-500">
											×
										</button>
									</div>
								))}
							</div>
						)}
						<p className="text-[10px] text-gray-400">
							Members will receive a payment request on their dashboard.
						</p>
					</div>
				)}
			</div>

			<button
				onClick={handleCheckout}
				className="w-full rounded-2xl bg-blue-600 p-5 text-xl font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98]"
			>
				Confirm Order
			</button>
		</div>
	);
}
