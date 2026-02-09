"use client";

import { useQueueStatus } from "@/src/hooks/token/useQueueStatus";
import { QueueStatusCard } from "./QueueStatusCard";
import type { TokenStatusType } from "@/src/types/token.types";
import { SkeletonBlock } from "@/src/components/ui/SkeletonBlock";
import { Radio, AlertCircle, RefreshCw } from "lucide-react";

interface Props {
	tokenId: number | undefined;
	tokenStatus: TokenStatusType | undefined;
}

const QUEUE_ELIGIBLE_STATUSES: TokenStatusType[] = ["active", "serving"];

/**
 * Smart component — manages SSE connection and renders queue status.
 * Only renders when token status is "active" or "serving".
 */
export function QueueStatusSection({ tokenId, tokenStatus }: Props) {
	const shouldShow =
		tokenId !== undefined &&
		tokenStatus !== undefined &&
		QUEUE_ELIGIBLE_STATUSES.includes(tokenStatus);

	const { data, isConnected, isEnded, error } = useQueueStatus({
		tokenId,
		tokenStatus,
		enabled: shouldShow,
	});

	// Debug logging in development
	if (process.env.NODE_ENV === "development" && shouldShow) {
		console.log("[QueueStatusSection] State:", {
			tokenId,
			tokenStatus,
			data,
			isConnected,
			isEnded,
			error,
		});
	}

	// Don't render if token is not in queue-eligible state
	if (!shouldShow) return null;

	// Queue has ended (token served or status changed) - show a message instead of nothing
	if (isEnded) {
		return (
			<div className="rounded-2xl border bg-gradient-to-br from-gray-50 to-slate-50 p-4">
				<div className="flex items-center gap-2 text-gray-500">
					<AlertCircle size={18} />
					<span className="text-sm font-medium">Queue session ended</span>
				</div>
			</div>
		);
	}

	// Error state - show retry indicator
	if (error && !data) {
		return (
			<div className="rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 p-4">
				<div className="flex items-center gap-2 text-amber-600">
					<RefreshCw size={18} className="animate-spin" />
					<span className="text-sm font-medium">Connecting to queue...</span>
				</div>
			</div>
		);
	}

	// Loading state — waiting for first SSE update
	if (!data) {
		return (
			<div className="rounded-2xl border bg-gradient-to-br from-indigo-50 to-purple-50 p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
							<Radio size={16} />
						</div>
						<span className="text-sm font-bold text-gray-900">Live Queue Status</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
						<span className="text-xs font-medium text-amber-600">Connecting...</span>
					</div>
				</div>
				<SkeletonBlock className="w-24 h-12 mx-auto" />
				<div className="grid grid-cols-2 gap-3">
					<SkeletonBlock className="h-16 rounded-xl" />
					<SkeletonBlock className="h-16 rounded-xl" />
				</div>
			</div>
		);
	}

	return <QueueStatusCard data={data} isConnected={isConnected} />;
}
