"use client";

import { Users, Clock, Hash, Zap, Radio, Loader2 } from "lucide-react";
import type { QueueStatusData } from "@/src/types/queueStatus.types";

interface Props {
	data: QueueStatusData;
	isConnected: boolean;
}

/**
 * Dumb component — displays real-time queue status.
 * Shows queue position, estimated wait, currently serving token, and tokens ahead.
 */
export function QueueStatusCard({ data, isConnected }: Props) {
	const isBeingServed = data.queue_position === 0;
	const isAwaitingAssignment = data.queue_position === -1;

	return (
		<div className="rounded-2xl border bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm overflow-hidden">
			{/* Header with live indicator */}
			<div className="px-4 py-3 border-b bg-white/60 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
						<Radio size={16} />
					</div>
					<span className="text-sm font-bold text-gray-900">Live Queue Status</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span
						className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
					/>
					<span
						className={`text-xs font-medium ${isConnected ? "text-green-600" : "text-gray-400"}`}
					>
						{isConnected ? "Live" : "Connecting..."}
					</span>
				</div>
			</div>

			<div className="p-4 space-y-4">
				{/* Awaiting assignment state */}
				{isAwaitingAssignment && (
					<div className="text-center py-4">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full">
							<Loader2 size={18} className="animate-spin" />
							<span className="text-lg font-bold">Awaiting Counter</span>
						</div>
						<p className="mt-2 text-sm text-gray-600">
							Your token is being assigned to a counter...
						</p>
					</div>
				)}

				{/* Now serving state */}
				{isBeingServed && (
					<div className="text-center py-4">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
							<Zap size={18} className="animate-pulse" />
							<span className="text-lg font-bold">Now Serving!</span>
						</div>
						<p className="mt-2 text-sm text-gray-600">
							Please proceed to <span className="font-semibold">{data.counter_name}</span>
						</p>
					</div>
				)}

				{/* Normal queue position display */}
				{!isBeingServed && !isAwaitingAssignment && (
					<div className="text-center">
						<p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
							Your Position
						</p>
						<div className="text-5xl font-black text-indigo-600">{data.queue_position}</div>
					</div>
				)}

				{/* Stats grid - only show when in queue (not awaiting, not serving) */}
				{!isAwaitingAssignment && (
					<div className="grid grid-cols-2 gap-3">
						{/* Tokens ahead */}
						{!isBeingServed && (
							<div className="bg-white/80 rounded-xl p-3 flex items-center gap-2.5">
								<div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
									<Users size={16} />
								</div>
								<div>
									<p className="text-xs text-gray-500">Ahead</p>
									<p className="text-sm font-bold text-gray-900">
										{data.tokens_ahead} {data.tokens_ahead === 1 ? "token" : "tokens"}
									</p>
								</div>
							</div>
						)}

						{/* Estimated wait */}
						{!isBeingServed && data.estimated_wait_time > 0 && (
							<div className="bg-white/80 rounded-xl p-3 flex items-center gap-2.5">
								<div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
									<Clock size={16} />
								</div>
								<div>
									<p className="text-xs text-gray-500">Est. Wait</p>
									<p className="text-sm font-bold text-gray-900">~{data.estimated_wait_time} min</p>
								</div>
							</div>
						)}

						{/* Currently serving */}
						{data.currently_serving && !isBeingServed && (
							<div className="bg-white/80 rounded-xl p-3 flex items-center gap-2.5 col-span-2">
								<div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
									<Hash size={16} />
								</div>
								<div>
									<p className="text-xs text-gray-500">Currently Serving</p>
									<p className="text-sm font-bold text-gray-900 font-mono">
										{data.currently_serving.token_number}
									</p>
								</div>
							</div>
						)}

						{/* Counter info when being served */}
						{isBeingServed && (
							<div className="bg-white/80 rounded-xl p-3 flex items-center gap-2.5 col-span-2">
								<div className="p-2 bg-green-100 text-green-600 rounded-lg">
									<Hash size={16} />
								</div>
								<div>
									<p className="text-xs text-gray-500">Counter</p>
									<p className="text-sm font-bold text-gray-900">{data.counter_name}</p>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
