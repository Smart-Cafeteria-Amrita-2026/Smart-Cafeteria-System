import client from "prom-client";

// Create a custom registry (avoids polluting the global default)
export const register = new client.Registry();

// Add default Node.js metrics (GC, event loop, heap, etc.)
client.collectDefaultMetrics({ register });

// ─── Custom Application Metrics ────────────────────────────

/** Total HTTP requests counter – labelled by method, route, status */
export const httpRequestsTotal = new client.Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests",
	labelNames: ["method", "route", "status_code"] as const,
	registers: [register],
});

/** HTTP request duration histogram (seconds) */
export const httpRequestDuration = new client.Histogram({
	name: "http_request_duration_seconds",
	help: "Duration of HTTP requests in seconds",
	labelNames: ["method", "route", "status_code"] as const,
	buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
	registers: [register],
});

/** Active HTTP connections gauge */
export const httpActiveRequests = new client.Gauge({
	name: "http_active_requests",
	help: "Number of in-flight HTTP requests",
	registers: [register],
});

// ─── Business Metrics ──────────────────────────────────────

/** Booking operations counter */
export const bookingsTotal = new client.Counter({
	name: "cafeteria_bookings_total",
	help: "Total number of booking operations",
	labelNames: ["action", "status"] as const,
	registers: [register],
});

/** Payment operations counter */
export const paymentsTotal = new client.Counter({
	name: "cafeteria_payments_total",
	help: "Total number of payment operations",
	labelNames: ["type", "status"] as const,
	registers: [register],
});

/** Authentication events counter */
export const authEventsTotal = new client.Counter({
	name: "cafeteria_auth_events_total",
	help: "Total authentication events",
	labelNames: ["event"] as const,
	registers: [register],
});
