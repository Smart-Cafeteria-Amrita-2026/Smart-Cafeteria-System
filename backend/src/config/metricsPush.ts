import protobuf from "protobufjs";
import snappyjs from "snappyjs";
import { register } from "./metrics";
import { logger } from "./logger";

const PUSH_INTERVAL_MS = 15_000; // Push every 15 seconds

// ─── Prometheus Remote-Write Protobuf Schema ───────────────

const protoRoot = protobuf.Root.fromJSON({
	nested: {
		prometheus: {
			nested: {
				WriteRequest: {
					fields: {
						timeseries: { rule: "repeated", type: "TimeSeries", id: 1 },
					},
				},
				TimeSeries: {
					fields: {
						labels: { rule: "repeated", type: "Label", id: 1 },
						samples: { rule: "repeated", type: "Sample", id: 2 },
					},
				},
				Label: {
					fields: {
						name: { type: "string", id: 1 },
						value: { type: "string", id: 2 },
					},
				},
				Sample: {
					fields: {
						value: { type: "double", id: 1 },
						timestamp: { type: "int64", id: 2 },
					},
				},
			},
		},
	},
});

const WriteRequest = protoRoot.lookupType("prometheus.WriteRequest");

// ─── Push Logic ────────────────────────────────────────────

async function pushMetrics(): Promise<void> {
	const url = process.env.GRAFANA_PROM_URL;
	const user = process.env.GRAFANA_PROM_USER;
	const token = process.env.GRAFANA_PROM_TOKEN;

	if (!url || !user || !token) return;

	try {
		const metrics = (await register.getMetricsAsJSON()) as unknown as Array<{
			name: string;
			type: string;
			values: Array<{
				value: number;
				labels: Record<string, string>;
				metricName?: string;
			}>;
		}>;

		const now = Date.now();
		const timeseries: Array<{
			labels: Array<{ name: string; value: string }>;
			samples: Array<{ value: number; timestamp: number }>;
		}> = [];

		for (const metric of metrics) {
			if (!metric.values || !Array.isArray(metric.values)) continue;

			for (const val of metric.values) {
				// metricName is set for histogram sub-metrics (_bucket, _sum, _count)
				const name = val.metricName || metric.name;

				const labels: Array<{ name: string; value: string }> = [{ name: "__name__", value: name }];

				if (val.labels) {
					for (const [k, v] of Object.entries(val.labels)) {
						labels.push({ name: k, value: String(v) });
					}
				}

				timeseries.push({
					labels,
					samples: [{ value: val.value, timestamp: now }],
				});
			}
		}

		if (timeseries.length === 0) return;

		// Encode as protobuf
		const message = WriteRequest.create({ timeseries });
		const encoded = WriteRequest.encode(message).finish();

		// Compress with snappy
		const compressed = snappyjs.compress(encoded);

		// Push to Grafana Cloud
		const basicAuth = Buffer.from(`${user}:${token}`).toString("base64");

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-protobuf",
				"Content-Encoding": "snappy",
				"X-Prometheus-Remote-Write-Version": "0.1.0",
				Authorization: `Basic ${basicAuth}`,
			},
			body: Buffer.from(compressed),
		});

		if (!response.ok) {
			const body = await response.text().catch(() => "");
			logger.warn(`Metrics push failed: ${response.status} ${response.statusText}`, { body });
		}
	} catch (err) {
		logger.warn("Metrics push error", { error: (err as Error).message });
	}
}

// ─── Lifecycle ─────────────────────────────────────────────

let pushInterval: ReturnType<typeof setInterval> | null = null;

export function startMetricsPush(): void {
	const url = process.env.GRAFANA_PROM_URL;
	const user = process.env.GRAFANA_PROM_USER;
	const token = process.env.GRAFANA_PROM_TOKEN;

	if (!url || !user || !token) {
		logger.info("Prometheus push disabled (GRAFANA_PROM_* env vars not set)");
		return;
	}

	logger.info("Starting Prometheus metrics push to Grafana Cloud (every 15s)");

	// Push once immediately, then on interval
	pushMetrics();
	pushInterval = setInterval(pushMetrics, PUSH_INTERVAL_MS);
}

export function stopMetricsPush(): void {
	if (pushInterval) {
		clearInterval(pushInterval);
		pushInterval = null;
	}
}
