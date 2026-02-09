"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingDetail, useCancelBooking } from "@/src/hooks/myBookings/useBookingDetail";
import { useSettleBill } from "@/src/hooks/wallet/useWallet";
import { BookingDetailSkeleton } from "./BookingDetailSkeleton";
import { BookingStatusHeader } from "./BookingStatusHeader";
import { BookingInfoSection } from "./BookingInfoSection";
import { BookingMenuSection } from "./BookingMenuSection";
import { BookingGroupMembersSection } from "./BookingGroupMembersSection";
import { BookingPaymentSection } from "./BookingPaymentSection";
import { CancelBookingModal } from "./CancelBookingModal";
import { AddMoneyModal } from "./AddMoneyModal";
import { BookingTokenSection } from "./BookingTokenSection";

interface Props {
	bookingId: number;
}

export function BookingDetailView({ bookingId }: Props) {
	const router = useRouter();
	const { data: booking, isLoading, error } = useBookingDetail(bookingId);
	const { mutateAsync: cancelBooking, isPending: isCancelling } = useCancelBooking(bookingId);
	const { mutateAsync: settleBill, isPending: isSettling } = useSettleBill();

	const [showCancelModal, setShowCancelModal] = useState(false);
	const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

	if (isLoading) return <BookingDetailSkeleton />;

	if (error || !booking) {
		return (
			<div className="p-6 text-center text-red-500 bg-white rounded-xl shadow">
				Failed to load booking details. Please try again.
			</div>
		);
	}

	const slot = booking.slot ?? booking.meal_slots;
	const menuItems = booking.menu_items ?? booking.booking_menu_items ?? [];
	const groupMembers = booking.group_members ?? booking.booking_group_members ?? [];

	const isEditable = booking.booking_status === "pending_payment";
	const isCancellable = booking.booking_status === "pending_payment";

	const handleCancel = async (reason?: string) => {
		await cancelBooking(reason);
		setShowCancelModal(false);
		router.push("/my-bookings");
	};

	const handlePayBill = async () => {
		await settleBill(bookingId);
	};

	return (
		<div className="space-y-5">
			{/* Status header with action button (Pay Bill / Add Money / etc.) */}
			<BookingStatusHeader
				bookingId={bookingId}
				bookingReference={booking.booking_reference}
				bookingStatus={booking.booking_status}
				totalAmount={booking.total_amount}
				walletBalance={booking.wallet_balance}
				slotDate={slot?.slot_date ?? ""}
				paymentWindowStart={slot?.payment_window_start ?? ""}
				paymentWindowEnd={slot?.payment_window_end ?? ""}
				onAddMoney={() => setShowAddMoneyModal(true)}
				onPayBill={handlePayBill}
				isSettling={isSettling}
			/>

			{/* Token Section — shown when a token exists for this booking */}
			<BookingTokenSection
				bookingReference={booking.booking_reference}
				bookingStatus={booking.booking_status}
			/>

			{/* Booking Info (slot, date, time, type) */}
			<BookingInfoSection
				slot={slot}
				bookingType={booking.booking_type}
				groupSize={booking.group_size}
				createdAt={booking.created_at}
				paymentDeadline={booking.payment_deadline}
			/>

			{/* Menu Items Section */}
			<BookingMenuSection
				bookingId={bookingId}
				menuItems={menuItems}
				slotId={booking.slot_id}
				slotName={slot?.slot_name ?? ""}
				isEditable={isEditable}
			/>

			{/* Group Members Section */}
			{booking.is_group_booking && (
				<BookingGroupMembersSection
					bookingId={bookingId}
					groupMembers={groupMembers}
					isEditable={isEditable}
				/>
			)}

			{/* Payment Summary */}
			<BookingPaymentSection
				totalAmount={booking.total_amount}
				walletBalance={booking.wallet_balance}
				menuItems={menuItems}
				groupSize={booking.group_size}
				bookingReference={booking.booking_reference}
			/>

			{/* Cancel Button */}
			{isCancellable && (
				<button
					onClick={() => setShowCancelModal(true)}
					disabled={isCancelling}
					className="w-full rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-red-600 font-bold text-sm hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50"
				>
					{isCancelling ? "Cancelling..." : "Cancel Booking"}
				</button>
			)}

			{/* Cancel Modal */}
			{showCancelModal && (
				<CancelBookingModal
					onConfirm={handleCancel}
					onClose={() => setShowCancelModal(false)}
					isLoading={isCancelling}
				/>
			)}

			{/* Add Money Modal */}
			{showAddMoneyModal && (
				<AddMoneyModal
					bookingId={bookingId}
					totalAmount={booking.total_amount}
					bookingWalletBalance={booking.wallet_balance}
					onClose={() => setShowAddMoneyModal(false)}
				/>
			)}
		</div>
	);
}
