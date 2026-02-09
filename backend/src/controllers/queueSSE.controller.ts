import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import { getUserQueueStatus } from "../services/tokenService";
import { z } from "zod";

const sseQuerySchema = z.object({
	token_id: z.string().regex(/^\d+$/, "token_id must be a number"),
});

/**
 * GET /api/tokens/queue/live?token_id=X
 * Server-Sent Events endpoint for real-time queue status updates
 *
 * Streams queue position updates every 3 seconds for tokens in "active" or "serving" state.
 * Client should close connection when token status changes to "served" or "cancelled".
 */
export const queueStatusSSEController = (req: Request, res: Response): void => {
	const validation = sseQuerySchema.safeParse(req.query);

	if (!validation.success) {
		res.status(STATUS.BADREQUEST).json({
			success: false,
			error: "Invalid token_id parameter",
		});
		return;
	}

	const tokenId = parseInt(validation.data.token_id, 10);

	// Set SSE headers
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache, no-transform");
	res.setHeader("Connection", "keep-alive");
	res.setHeader("X-Accel-Buffering", "no"); // Disable buffering for nginx

	// Flush headers immediately to establish SSE connection
	res.flushHeaders();

	// Send initial connection event
	res.write(`event: connected\ndata: ${JSON.stringify({ token_id: tokenId })}\n\n`);

	// Interval to send queue updates every 3 seconds
	const INTERVAL_MS = 3000;
	let isConnectionActive = true;
	let intervalId: NodeJS.Timeout | null = null;

	// Cleanup function
	const cleanup = () => {
		if (!isConnectionActive) return;
		isConnectionActive = false;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		try {
			res.end();
		} catch {
			// Connection may already be closed
		}
	};

	const sendQueueUpdate = async () => {
		if (!isConnectionActive) return;

		try {
			const result = await getUserQueueStatus(tokenId);

			if (!isConnectionActive) return;

			if (!result.success) {
				// Token is no longer in queue (served, cancelled, etc.)
				res.write(`event: queue_ended\ndata: ${JSON.stringify({ error: result.error })}\n\n`);
				cleanup();
				return;
			}

			res.write(`event: queue_update\ndata: ${JSON.stringify(result.data)}\n\n`);
		} catch (error) {
			console.error("SSE queue update error:", error);
			// Don't end connection on transient errors, just skip this update
		}
	};

	// Handle client disconnect
	req.on("close", cleanup);
	req.on("error", cleanup);
	res.on("close", cleanup);
	res.on("error", cleanup);

	// Send initial update immediately
	sendQueueUpdate();

	// Set up interval for subsequent updates
	intervalId = setInterval(sendQueueUpdate, INTERVAL_MS);

	// Send heartbeat every 30 seconds to keep connection alive
	const heartbeatId = setInterval(() => {
		if (!isConnectionActive) {
			clearInterval(heartbeatId);
			return;
		}
		try {
			res.write(`:heartbeat\n\n`);
		} catch {
			cleanup();
		}
	}, 30000);

	// Clean up heartbeat on connection close
	req.on("close", () => clearInterval(heartbeatId));
};
