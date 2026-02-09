"use client";

import { Ticket } from "lucide-react";
import type { TokenStatusType } from "@/src/types/token.types";

interface Props {
	tokenNumber: string;
	tokenStatus: TokenStatusType;
}

const BADGE_STYLES: Record<TokenStatusType, string> = {
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	active: "bg-blue-50 text-blue-700 border-blue-200",
	serving: "bg-purple-50 text-purple-700 border-purple-200",
	served: "bg-green-50 text-green-700 border-green-200",
	cancelled: "bg-red-50 text-red-700 border-red-200",
	no_show: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_LABEL: Record<TokenStatusType, string> = {
	pending: "Pending",
	active: "Active",
	serving: "Serving",
	served: "Served",
	cancelled: "Cancelled",
	no_show: "No Show",
};

/**
 * Compact token badge for the booking list card.
 * Dumb component — receives token info as props.
 */
export function TokenBadge({ tokenNumber, tokenStatus }: Props) {
	return (
		<div
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${BADGE_STYLES[tokenStatus]}`}
		>
			<Ticket size={12} className="shrink-0" />
			<span className="truncate max-w-30 sm:max-w-40">{tokenNumber}</span>
			<span className="text-[10px] opacity-75">({STATUS_LABEL[tokenStatus]})</span>
		</div>
	);
}
