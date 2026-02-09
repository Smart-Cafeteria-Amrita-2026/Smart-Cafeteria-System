"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TokenService } from "@/src/services/token/TokenService";
import type { QueueStatusData } from "@/src/types/queueStatus.types";
import type { TokenStatusType } from "@/src/types/token.types";

interface UseQueueStatusOptions {
	tokenId: number | undefined;
	tokenStatus: TokenStatusType | undefined;
	enabled?: boolean;
}

interface UseQueueStatusResult {
	data: QueueStatusData | null;
	isConnected: boolean;
	isEnded: boolean;
	error: string | null;
}

const QUEUE_ELIGIBLE_STATUSES: TokenStatusType[] = ["active", "serving"];

/**
 * Custom hook for real-time queue status via SSE.
 * Only connects when token status is "active" or "serving".
 */
export function useQueueStatus({
	tokenId,
	tokenStatus,
	enabled = true,
}: UseQueueStatusOptions): UseQueueStatusResult {
	const [data, setData] = useState<QueueStatusData | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isEnded, setIsEnded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const eventSourceRef = useRef<EventSource | null>(null);

	const shouldConnect =
		enabled &&
		tokenId !== undefined &&
		tokenStatus !== undefined &&
		QUEUE_ELIGIBLE_STATUSES.includes(tokenStatus);

	const cleanup = useCallback(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}
		setIsConnected(false);
	}, []);

	useEffect(() => {
		if (!shouldConnect || !tokenId) {
			cleanup();
			setData(null);
			setIsEnded(false);
			setError(null);
			return;
		}

		const url = TokenService.getQueueStatusSSEUrl(tokenId);
		const eventSource = new EventSource(url);
		eventSourceRef.current = eventSource;

		eventSource.addEventListener("connected", () => {
			setIsConnected(true);
			setError(null);
		});

		eventSource.addEventListener("queue_update", (event) => {
			try {
				const queueData = JSON.parse(event.data) as QueueStatusData;
				setData(queueData);
				setError(null);
			} catch {
				console.error("Failed to parse queue update:", event.data);
			}
		});

		eventSource.addEventListener("queue_ended", (event) => {
			try {
				const endData = JSON.parse(event.data) as { error: string };
				setIsEnded(true);
				setError(endData.error);
				cleanup();
			} catch {
				setIsEnded(true);
				cleanup();
			}
		});

		eventSource.onerror = () => {
			// SSE automatically reconnects, but we track the disconnected state
			setIsConnected(false);
		};

		return cleanup;
	}, [shouldConnect, tokenId, cleanup]);

	return { data, isConnected, isEnded, error };
}
