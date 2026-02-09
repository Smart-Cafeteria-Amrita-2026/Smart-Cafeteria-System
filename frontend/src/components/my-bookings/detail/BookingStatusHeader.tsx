"use client";

import { Hash, Wallet, CreditCard, Lock, Loader2 } from "lucide-react";
import type { MyBookingStatus } from "@/src/types/myBookings.types";

interface Props {
	bookingId: number;
	bookingReference: string;
	bookingStatus: MyBookingStatus;
	totalAmount: number;
	walletBalance: number;
	slotDate: string;
	paymentWindowStart: string;
	paymentWindowEnd: string;
	onAddMoney: () => void;
	onPayBill: () => void;
	isSettling?: boolean;
}

const STATUS_STYLES: Record<MyBookingStatus, string> = {
	pending_payment: "text-amber-700 bg-amber-50 border-amber-200",
	confirmed: "text-blue-700 bg-blue-50 border-blue-200",
	completed: "text-green-700 bg-green-50 border-green-200",
	cancelled: "text-red-700 bg-red-50 border-red-200",
	no_show: "text-gray-700 bg-gray-100 border-gray-200",
};

const STATUS_LABEL: Record<MyBookingStatus, string> = {
	pending_payment: "Pending Payment",
	confirmed: "Confirmed",
	completed: "Completed",
	cancelled: "Cancelled",
	no_show: "No Show",
};

function toDateWithTime(dateStr: string, timeStr: string): Date {
	return new Date(`${dateStr}T${timeStr}`);
}

interface ButtonState {
	label: string;
	disabled: boolean;
	variant: "primary" | "success" | "warning" | "muted";
	icon: "wallet" | "creditCard" | "lock";
	action?: string;
}

function getButtonState(
	status: MyBookingStatus,
	totalAmount: number,
	walletBalance: number,
	slotDate: string,
	paymentWindowStart: string,
	paymentWindowEnd: string
): ButtonState {
	if (status !== "pending_payment") {
		return { label: STATUS_LABEL[status], disabled: true, variant: "muted", icon: "lock" };
	}

	const now = new Date();
	const windowStart = toDateWithTime(slotDate, paymentWindowStart);
	const windowEnd = toDateWithTime(slotDate, paymentWindowEnd);

	// After payment window — expired
	if (now > windowEnd) {
		return { label: "Payment Expired", disabled: true, variant: "muted", icon: "lock" };
	}

	// Pay Bill: only during payment window AND sufficient balance
	const inPaymentWindow = now >= windowStart && now <= windowEnd;
	if (inPaymentWindow && walletBalance >= totalAmount) {
		return {
			label: "Pay Bill",
			disabled: false,
			variant: "success",
			icon: "creditCard",
			action: "pay",
		};
	}

	// Funded: wallet covers total but payment window hasn't started yet
	if (totalAmount === walletBalance && !inPaymentWindow) {
		return { label: "Funded", disabled: true, variant: "muted", icon: "lock" };
	}

	// Add Money: before window starts OR during window with insufficient balance
	return {
		label: "Add Money",
		disabled: false,
		variant: "warning",
		icon: "wallet",
		action: "wallet",
	};
}

const BUTTON_VARIANT_STYLES: Record<ButtonState["variant"], string> = {
	primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
	success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200",
	warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-200",
	muted: "bg-gray-100 text-gray-400 cursor-not-allowed",
};

const BUTTON_ICONS = {
	wallet: Wallet,
	creditCard: CreditCard,
	lock: Lock,
};

export function BookingStatusHeader({
	// _bookingId,
	bookingReference,
	bookingStatus,
	totalAmount,
	walletBalance,
	slotDate,
	paymentWindowStart,
	paymentWindowEnd,
	onAddMoney,
	onPayBill,
	isSettling,
}: Props) {
	const btn = getButtonState(
		bookingStatus,
		totalAmount,
		walletBalance,
		slotDate,
		paymentWindowStart,
		paymentWindowEnd
	);
	const BtnIcon = BUTTON_ICONS[btn.icon];

	const handleButtonClick = () => {
		if (btn.disabled || isSettling) return;
		if (btn.action === "pay") {
			onPayBill();
		} else if (btn.action === "wallet") {
			onAddMoney();
		}
	};

	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
			{/* Colored top bar based on status */}
			<div
				className={`h-1.5 ${
					bookingStatus === "pending_payment"
						? "bg-amber-400"
						: bookingStatus === "confirmed"
							? "bg-blue-400"
							: bookingStatus === "completed"
								? "bg-green-400"
								: bookingStatus === "cancelled"
									? "bg-red-400"
									: "bg-gray-300"
				}`}
			/>
			<div className="p-5 space-y-4">
				{/* Reference + Action Button */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2 min-w-0">
						<Hash size={16} className="shrink-0 text-gray-400" />
						<span className="text-lg font-black text-gray-900 truncate">{bookingReference}</span>
					</div>
					<button
						type="button"
						disabled={btn.disabled || isSettling}
						onClick={handleButtonClick}
						className={`flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-bold whitespace-nowrap transition-all ${BUTTON_VARIANT_STYLES[btn.variant]}`}
					>
						{isSettling ? (
							<>
								<Loader2 size={18} className="animate-spin" />
								Settling...
							</>
						) : (
							<>
								<BtnIcon size={18} />
								{btn.label}
							</>
						)}
					</button>
				</div>

				{/* Status badge */}
				<span
					className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${STATUS_STYLES[bookingStatus]}`}
				>
					{STATUS_LABEL[bookingStatus]}
				</span>
			</div>
		</div>
	);
}
