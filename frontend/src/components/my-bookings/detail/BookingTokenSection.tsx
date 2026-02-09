"use client";

import { useTokenByBookingReference } from "@/src/hooks/token/useToken";
import { TokenDetailCard } from "./TokenDetailCard";
import { TokenDetailCardSkeleton } from "./TokenDetailCardSkeleton";
import { QueueStatusSection } from "./QueueStatusSection";
import { Ticket } from "lucide-react";
import type { MyBookingStatus } from "@/src/types/myBookings.types";

interface Props {
	bookingReference: string;
	bookingStatus: MyBookingStatus;
}

const TOKEN_ELIGIBLE_STATUSES: MyBookingStatus[] = ["confirmed", "completed"];

/**
 * Smart component — fetches token data by booking reference and renders TokenDetailCard.
 * Only fetches when the booking is confirmed or completed. Shows nothing otherwise.
 * Also renders QueueStatusSection for real-time queue updates when token is active/serving.
 */
export function BookingTokenSection({ bookingReference, bookingStatus }: Props) {
	const isEligible = TOKEN_ELIGIBLE_STATUSES.includes(bookingStatus);
	const { data: token, isLoading } = useTokenByBookingReference(
		isEligible ? bookingReference : undefined
	);

	if (isLoading) {
		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
						<Ticket size={18} />
					</div>
					<h2 className="text-base font-bold text-gray-900">Your Token</h2>
				</div>
				<TokenDetailCardSkeleton />
			</div>
		);
	}

	// No token generated yet — don't render the section
	if (!token) return null;

	return (
		<div className="space-y-4">
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
						<Ticket size={18} />
					</div>
					<h2 className="text-base font-bold text-gray-900">Your Token</h2>
				</div>
				<TokenDetailCard token={token} />
			</div>

			{/* Real-time Queue Status — only shows when token is active or serving */}
			<QueueStatusSection tokenId={token.token_id} tokenStatus={token.token_status} />
		</div>
	);
}
