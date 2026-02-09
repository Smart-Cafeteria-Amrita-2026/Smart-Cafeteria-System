"use client";

import { useRouter } from "next/navigation";
import {
	Calendar,
	Clock,
	Users,
	Hash,
	IndianRupee,
	Wallet,
	CreditCard,
	Lock,
	ArrowRight,
} from "lucide-react";
import type { MyBookingStatus } from "@/src/types/myBookings.types";
import { BookingTokenBadge } from "./BookingTokenBadge";

interface Props {
	bookingId: number;
	bookingReference: string;
	groupSize: number;
	bookingStatus: MyBookingStatus;
	totalAmount: number;
	walletBalance: number;
	slotDate: string;
	slotName: string;
	startTime: string;
	paymentWindowStart: string;
	paymentWindowEnd: string;
	onAddMoney: () => void;
	onPayBill: () => void;
	isSettling?: boolean;
}

const STATUS_STYLES: Record<MyBookingStatus, string> = {
	pending_payment: "text-amber-700 bg-amber-50 border border-amber-200",
	confirmed: "text-blue-700 bg-blue-50 border border-blue-200",
	completed: "text-green-700 bg-green-50 border border-green-200",
	cancelled: "text-red-700 bg-red-50 border border-red-200",
	no_show: "text-gray-700 bg-gray-100 border border-gray-200",
};

const STATUS_LABEL: Record<MyBookingStatus, string> = {
	pending_payment: "Pending Payment",
	confirmed: "Confirmed",
	completed: "Completed",
	cancelled: "Cancelled",
	no_show: "No Show",
};

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
}

function formatTime(time: string): string {
	const [hours, minutes] = time.split(":");
	const h = Number(hours);
	const suffix = h >= 12 ? "PM" : "AM";
	const displayHour = h % 12 || 12;
	return `${displayHour}:${minutes} ${suffix}`;
}

/**
 * Convert an HH:MM:SS time string on a given date to a Date object.
 */
function toDateWithTime(dateStr: string, timeStr: string): Date {
	return new Date(`${dateStr}T${timeStr}`);
}

interface ButtonState {
	label: string;
	disabled: boolean;
	variant: "primary" | "success" | "warning" | "muted";
	icon: "wallet" | "creditCard" | "lock";
	action?: "pay" | "wallet";
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
		return {
			label: STATUS_LABEL[status],
			disabled: true,
			variant: "muted",
			icon: "lock",
		};
	}

	const now = new Date();
	const windowStart = toDateWithTime(slotDate, paymentWindowStart);
	const windowEnd = toDateWithTime(slotDate, paymentWindowEnd);

	// After payment window — expired
	if (now > windowEnd) {
		return {
			label: "Payment Expired",
			disabled: true,
			variant: "muted",
			icon: "lock",
		};
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

	if (totalAmount === walletBalance && !inPaymentWindow) {
		return {
			label: "Funded",
			disabled: true,
			variant: "muted",
			icon: "lock",
		};
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

export function MyBookingCard({
	bookingId,
	bookingReference,
	groupSize,
	bookingStatus,
	totalAmount,
	walletBalance,
	slotDate,
	slotName,
	startTime,
	paymentWindowStart,
	paymentWindowEnd,
	onAddMoney,
	onPayBill,
	isSettling,
}: Props) {
	const router = useRouter();
	const btn = getButtonState(
		bookingStatus,
		totalAmount,
		walletBalance,
		slotDate,
		paymentWindowStart,
		paymentWindowEnd
	);
	const BtnIcon = BUTTON_ICONS[btn.icon];

	return (
		// biome-ignore lint/a11y/useSemanticElements: Using div with role="button" is intentional - we need nested interactive buttons inside
		<div
			role="button"
			tabIndex={0}
			onClick={() => router.push(`/my-bookings/${bookingId}`)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					router.push(`/my-bookings/${bookingId}`);
				}
			}}
			className="group flex items-stretch rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer w-full text-left overflow-hidden"
		>
			{/* Left: content area with View Details hover */}
			<div className="relative flex-1 p-4 sm:p-5 space-y-2.5 min-w-0 min-h-[116px]">
				{/* Blue overlay that appears on hover - covers entire left area */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

				{/* View Details text - centered, visible on hover */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
					<div className="flex items-center gap-2 text-white font-bold">
						<span className="text-sm sm:text-base">View Details</span>
						<ArrowRight
							size={20}
							className="transition-transform duration-300 group-hover:translate-x-1"
						/>
					</div>
				</div>

				{/* Row 1: Reference + Status badge */}
				<div className="relative z-0 flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1.5 min-w-0">
						<Hash size={14} className="shrink-0 text-gray-400" />
						<span className="text-sm font-bold text-gray-900 truncate">{bookingReference}</span>
					</div>
					<span
						className={`shrink-0 ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide leading-tight ${STATUS_STYLES[bookingStatus]}`}
					>
						{STATUS_LABEL[bookingStatus]}
					</span>
				</div>

				{/* Row 2: Details — responsive grid */}
				<div className="relative z-0 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-gray-600">
					<div className="flex items-center gap-1.5">
						<Clock size={14} className="shrink-0 text-indigo-400" />
						<span className="font-medium">{slotName}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Calendar size={14} className="shrink-0 text-gray-400" />
						<span className="font-medium">{formatDate(slotDate)}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Clock size={14} className="shrink-0 text-blue-400" />
						<span className="font-medium">{formatTime(startTime)}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Users size={14} className="shrink-0 text-gray-400" />
						<span className="font-medium">
							{groupSize} {groupSize === 1 ? "person" : "people"}
						</span>
					</div>
					<div className="flex items-center gap-1 font-bold text-gray-900">
						<IndianRupee size={13} />
						{totalAmount.toFixed(2)}
					</div>
				</div>

				{/* Row 3: Token badge or pending message - min-height ensures consistent card size */}
				<div className="relative z-0 min-h-[24px]">
					{bookingStatus === "pending_payment" ? (
						<span className="text-xs text-gray-400 italic">Token generation pending</span>
					) : (
						<BookingTokenBadge bookingReference={bookingReference} bookingStatus={bookingStatus} />
					)}
				</div>
			</div>

			{/* Right: Action button — vertically centered, fixed width */}
			<div className="flex items-center justify-center px-3 sm:px-5 border-l bg-gray-50/60 shrink-0 min-w-[140px]">
				<button
					type="button"
					disabled={btn.disabled || isSettling}
					onClick={(e) => {
						e.stopPropagation();
						if (btn.disabled || isSettling) return;
						if (btn.action === "pay") {
							onPayBill();
						} else if (btn.action === "wallet") {
							onAddMoney();
						}
					}}
					className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${BUTTON_VARIANT_STYLES[btn.variant]}`}
				>
					{isSettling ? (
						<span className="flex items-center gap-1.5">
							<span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Settling...
						</span>
					) : (
						<>
							<BtnIcon size={16} />
							{btn.label}
						</>
					)}
				</button>
			</div>
		</div>
	);
}
