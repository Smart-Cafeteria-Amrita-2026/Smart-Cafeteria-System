import winston from "winston";
import LokiTransport from "winston-loki";

const { combine, timestamp, json, errors, printf } = winston.format;

// Pretty format for local development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
	const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
	return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
});

// Build transports array
const transports: winston.transport[] = [
	new winston.transports.Console({
		format: combine(timestamp(), process.env.NODE_ENV === "production" ? json() : devFormat),
	}),
];

// Add Loki transport only when credentials are configured
const lokiHost = process.env.GRAFANA_LOKI_URL;
const lokiUser = process.env.GRAFANA_LOKI_USER;
const lokiToken = process.env.GRAFANA_LOKI_TOKEN;

if (lokiHost && lokiUser && lokiToken) {
	transports.push(
		new LokiTransport({
			host: lokiHost,
			basicAuth: `${lokiUser}:${lokiToken}`,
			labels: {
				app: "smart-cafeteria-backend",
				env: process.env.NODE_ENV || "development",
			},
			json: true,
			batching: true,
			interval: 5,
			replaceTimestamp: true,
			format: combine(timestamp(), json()),
			onConnectionError: (err: Error) => {
				console.error("Loki connection error:", err.message);
			},
		})
	);
}

export const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: combine(errors({ stack: true }), timestamp(), json()),
	defaultMeta: { service: "smart-cafeteria-backend" },
	transports,
});
