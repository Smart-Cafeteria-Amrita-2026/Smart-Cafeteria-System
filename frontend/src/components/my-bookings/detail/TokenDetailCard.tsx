"use client";

import { Ticket, MapPin, Clock, Users, Hash, CircleDot } from "lucide-react";
import type { TokenStatusType, TokenWithDetails } from "@/src/types/token.types";

interface Props {
	token: TokenWithDetails;
}

const STATUS_STYLES: Record<TokenStatusType, string> = {
	pending: "text-amber-700 bg-amber-50 border-amber-200",
	active: "text-blue-700 bg-blue-50 border-blue-200",
	serving: "text-purple-700 bg-purple-50 border-purple-200",
	served: "text-green-700 bg-green-50 border-green-200",
	cancelled: "text-red-700 bg-red-50 border-red-200",
	no_show: "text-gray-700 bg-gray-100 border-gray-200",
};

const STATUS_LABEL: Record<TokenStatusType, string> = {
	pending: "Pending",
	active: "Active",
	serving: "Serving",
	served: "Served",
	cancelled: "Cancelled",
	no_show: "No Show",
};

const STATUS_BAR_COLOR: Record<TokenStatusType, string> = {
	pending: "bg-amber-400",
	active: "bg-blue-400",
	serving: "bg-purple-400",
	served: "bg-green-400",
	cancelled: "bg-red-400",
	no_show: "bg-gray-300",
};

function formatTime(time: string): string {
	const [hours, minutes] = time.split(":");
	const h = Number(hours);
	const suffix = h >= 12 ? "PM" : "AM";
	const displayHour = h % 12 || 12;
	return `${displayHour}:${minutes} ${suffix}`;
}

/**
 * Dumb component — displays full token details in a card.
 * Used inside the booking detail page (/my-bookings/[id]).
 */
export function TokenDetailCard({ token }: Props) {
	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
			{/* Colored top bar */}
			<div className={`h-1.5 ${STATUS_BAR_COLOR[token.token_status]}`} />

			<div className="p-4 sm:p-5 space-y-4">
				{/* Header: Token number + status */}
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div className="flex items-center gap-2 min-w-0">
						<div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
							<Ticket size={18} />
						</div>
						<span className="text-lg sm:text-xl font-black text-gray-900 tracking-wide truncate">
							{token.token_number}
						</span>
					</div>
					<span
						className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${STATUS_STYLES[token.token_status]}`}
					>
						{STATUS_LABEL[token.token_status]}
					</span>
				</div>

				{/* Details grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{/* Counter assignment */}
					{token.counter_details && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<MapPin size={15} className="shrink-0 text-gray-400" />
							<span className="font-medium">{token.counter_details.counter_name}</span>
						</div>
					)}

					{/* Queue position */}
					{token.queue_position !== null && token.queue_position > 0 && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Hash size={15} className="shrink-0 text-gray-400" />
							<span className="font-medium">Queue Position: {token.queue_position}</span>
						</div>
					)}

					{/* Estimated wait */}
					{token.estimated_wait_time !== null && token.estimated_wait_time > 0 && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Clock size={15} className="shrink-0 text-gray-400" />
							<span className="font-medium">~{token.estimated_wait_time} min wait</span>
						</div>
					)}

					{/* Slot info */}
					{token.slot_details && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<CircleDot size={15} className="shrink-0 text-gray-400" />
							<span className="font-medium">
								{token.slot_details.slot_name} &middot; {formatTime(token.slot_details.start_time)}{" "}
								– {formatTime(token.slot_details.end_time)}
							</span>
						</div>
					)}
				</div>

				{/* Group members */}
				{token.group_members.length > 0 && (
					<div className="pt-2 border-t">
						<div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
							<Users size={13} />
							<span className="font-semibold uppercase tracking-wide">Group Members</span>
						</div>
						<div className="flex flex-wrap gap-1.5">
							{token.group_members.map((m) => (
								<span
									key={m.user_id}
									className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
								>
									{m.first_name} {m.last_name}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Activation / served timestamps */}
				{(token.activated_at || token.served_at) && (
					<div className="pt-2 border-t flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
						{token.activated_at && (
							<span>
								Activated:{" "}
								{new Date(token.activated_at).toLocaleString("en-IN", {
									dateStyle: "medium",
									timeStyle: "short",
								})}
							</span>
						)}
						{token.served_at && (
							<span>
								Served:{" "}
								{new Date(token.served_at).toLocaleString("en-IN", {
									dateStyle: "medium",
									timeStyle: "short",
								})}
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
