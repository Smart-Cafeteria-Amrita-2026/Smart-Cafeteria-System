"use client";

import { useTokenByBookingReference } from "@/src/hooks/token/useToken";
import { TokenBadge } from "./TokenBadge";
import type { MyBookingStatus } from "@/src/types/myBookings.types";

interface Props {
	bookingReference: string;
	bookingStatus: MyBookingStatus;
}

const TOKEN_ELIGIBLE_STATUSES: MyBookingStatus[] = ["confirmed", "completed"];

/**
 * Smart component — fetches token by booking reference and renders a compact TokenBadge.
 * Only fetches when the booking is in an eligible status. Returns null otherwise.
 */
export function BookingTokenBadge({ bookingReference, bookingStatus }: Props) {
	const isEligible = TOKEN_ELIGIBLE_STATUSES.includes(bookingStatus);
	const { data: token } = useTokenByBookingReference(isEligible ? bookingReference : undefined);

	if (!token) return null;

	return <TokenBadge tokenNumber={token.token_number} tokenStatus={token.token_status} />;
}
