import type { Request, Response, NextFunction } from "express";
import { httpRequestsTotal, httpRequestDuration, httpActiveRequests } from "../config/metrics";

/**
 * Express middleware that records Prometheus metrics for every request.
 * - Increments a request counter (method, normalised route, status code)
 * - Observes request duration in a histogram
 * - Tracks active in-flight requests in a gauge
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
	// Skip the /metrics endpoint itself so it doesn't inflate counts
	if (req.path === "/metrics") {
		next();
		return;
	}

	const start = process.hrtime.bigint();
	httpActiveRequests.inc();

	res.on("finish", () => {
		httpActiveRequests.dec();

		// Normalise the route to avoid high-cardinality (replace UUIDs / numeric IDs)
		const route = normaliseRoute(req.route?.path ?? req.path);

		const labels = {
			method: req.method,
			route,
			status_code: String(res.statusCode),
		};

		httpRequestsTotal.inc(labels);

		const durationNs = Number(process.hrtime.bigint() - start);
		httpRequestDuration.observe(labels, durationNs / 1e9);
	});

	next();
}

/** Replace UUID-like and numeric segments with a placeholder to keep cardinality low */
function normaliseRoute(path: string): string {
	return path
		.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, ":id")
		.replace(/\/\d+/g, "/:id");
}
