import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import * as promClient from "prom-client";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// PROMETHEUS METRICS ------------------------------------------------------
// Collect default metrics (CPU, memory, etc.) with a prefix so metrics are grouped
promClient.collectDefaultMetrics({ prefix: "smart_cafeteria_" });

// Histogram for request durations and counter for request counts
const httpRequestDuration = new promClient.Histogram({
	name: "http_request_duration_seconds",
	help: "Duration of HTTP requests in seconds",
	labelNames: ["method", "route", "status_code"],
	buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new promClient.Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests",
	labelNames: ["method", "route", "status_code"],
});

// Metrics middleware to measure request durations and count
app.use((req, res, next) => {
	const end = httpRequestDuration.startTimer();
	res.on("finish", () => {
		const route = req.route?.path || req.path || "unknown";
		httpRequestsTotal.inc({ method: req.method, route, status_code: String(res.statusCode) });
		end({ method: req.method, route, status_code: String(res.statusCode) });
	});
	next();
});

// Expose metrics endpoint
app.get("/metrics", async (req, res) => {
	try {
		res.set("Content-Type", promClient.register.contentType);
		res.send(await promClient.register.metrics());
	} catch (err: any) {
		res.status(500).send(err.message);
	}
});
// -------------------------------------------------------------------------

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//AUTH ROUTES
app.use("/api/auth", authRoutes);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
