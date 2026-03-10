import { type ServiceResponse, STATUS } from "../interfaces/status.types";
import { logger } from "../config/logger";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SystemLogEntry {
	timestamp: string;
	level: string;
	message: string;
	event?: string;
	method?: string;
	path?: string;
	status_code?: number;
	duration_ms?: number;
	user_id?: string;
	user_email?: string;
	user_role?: string;
	ip?: string;
	error?: string;
	[key: string]: unknown;
}

export interface SystemLogFilters {
	level?: string;
	event?: string;
	search?: string;
	start?: string; // ISO timestamp
	end?: string; // ISO timestamp
	limit?: number;
}

export interface SystemLogResponse {
	logs: SystemLogEntry[];
	total: number;
}

// ─── Loki API response shape ─────────────────────────────────────────────────

interface LokiStreamValue {
	stream: Record<string, string>;
	values: [string, string][];
}

interface LokiQueryResponse {
	status: string;
	data: {
		resultType: string;
		result: LokiStreamValue[];
	};
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Query Grafana Cloud Loki for system logs.
 * Uses the Loki HTTP API: GET /loki/api/v1/query_range
 */
export async function querySystemLogs(
	filters: SystemLogFilters
): Promise<ServiceResponse<SystemLogResponse>> {
	const lokiHost = process.env.GRAFANA_LOKI_URL;
	const lokiUser = process.env.GRAFANA_LOKI_USER;
	// Prefer a dedicated read token; fall back to the push token
	const lokiToken = process.env.GRAFANA_LOKI_READ_TOKEN || process.env.GRAFANA_LOKI_TOKEN;

	if (!lokiHost || !lokiUser || !lokiToken) {
		return {
			success: false,
			error:
				"Loki is not configured. Set GRAFANA_LOKI_URL, GRAFANA_LOKI_USER, and GRAFANA_LOKI_READ_TOKEN (or GRAFANA_LOKI_TOKEN).",
			statusCode: STATUS.SERVICEUNAVAILABLE,
		};
	}

	const { level, event, search, limit = 100 } = filters;

	// Build LogQL query
	let logQL = '{app="smart-cafeteria-backend"}';

	if (level) {
		logQL += ` | json | level="${level}"`;
	} else {
		logQL += " | json";
	}

	if (event) {
		logQL += ` | event="${event}"`;
	}

	if (search) {
		logQL += ` |~ \`${search.replace(/[`\\]/g, "")}\``;
	}

	// Time range
	const now = new Date();
	const end = filters.end ? new Date(filters.end) : now;
	const start = filters.start
		? new Date(filters.start)
		: new Date(end.getTime() - 24 * 60 * 60 * 1000); // default: last 24h

	const params = new URLSearchParams({
		query: logQL,
		start: (start.getTime() * 1_000_000).toString(), // nanoseconds
		end: (end.getTime() * 1_000_000).toString(),
		limit: String(Math.min(limit, 500)),
		direction: "backward",
	});

	const url = `${lokiHost}/loki/api/v1/query_range?${params.toString()}`;
	const basicAuth = Buffer.from(`${lokiUser}:${lokiToken}`).toString("base64");

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${basicAuth}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const body = await response.text();
			logger.error("Loki query failed", {
				status: response.status,
				body: body.slice(0, 500),
			});
			return {
				success: false,
				error: `Loki query failed: ${response.status}`,
				statusCode: STATUS.BADGATEWAY,
			};
		}

		const json = (await response.json()) as LokiQueryResponse;

		if (json.status !== "success") {
			return {
				success: false,
				error: "Loki query returned non-success status",
				statusCode: STATUS.BADGATEWAY,
			};
		}

		// Parse streams into flat log entries
		const logs: SystemLogEntry[] = [];

		for (const stream of json.data.result) {
			for (const [tsNano, line] of stream.values) {
				try {
					const parsed = JSON.parse(line);
					logs.push({
						timestamp: parsed.timestamp || new Date(Number(tsNano) / 1_000_000).toISOString(),
						level: parsed.level || stream.stream.level || "info",
						message: parsed.message || line,
						event: parsed.event,
						method: parsed.method,
						path: parsed.path,
						status_code: parsed.status_code,
						duration_ms: parsed.duration_ms,
						user_id: parsed.user_id,
						user_email: parsed.user_email,
						user_role: parsed.user_role,
						ip: parsed.ip,
						error: parsed.error,
						service: parsed.service,
					});
				} catch {
					// Non-JSON log line – include as plain text
					logs.push({
						timestamp: new Date(Number(tsNano) / 1_000_000).toISOString(),
						level: stream.stream.level || "info",
						message: line,
					});
				}
			}
		}

		// Sort descending by timestamp
		logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

		return {
			success: true,
			statusCode: STATUS.SUCCESS,
			data: {
				logs,
				total: logs.length,
			},
		};
	} catch (err) {
		logger.error("Loki query error", { error: (err as Error).message });
		return {
			success: false,
			error: `Failed to query Loki: ${(err as Error).message}`,
			statusCode: STATUS.SERVERERROR,
		};
	}
}
