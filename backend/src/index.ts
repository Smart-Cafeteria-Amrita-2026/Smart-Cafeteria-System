import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import mealSlotRoutes from "./routes/mealSlotRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import forecastRoutes from "./routes/forecastRoutes";
import menuItemRoutes from "./routes/menuItemRoutes";
import adminRoutes from "./routes/adminRoutes";
import { register } from "./config/metrics";
import { logger } from "./config/logger";
import { metricsMiddleware } from "./middlewares/metrics.middleware";
import { startMetricsPush } from "./config/metricsPush";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//MIDDLEWARES
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);

// Prometheus metrics endpoint – must be before body parsers
app.get("/metrics", async (_req, res) => {
	try {
		res.set("Content-Type", register.contentType);
		res.end(await register.metrics());
	} catch (err) {
		res.status(500).end();
	}
});

// Health check endpoint for Render
app.get("/healthz", (_req, res) => {
	res.status(200).json({ status: "ok", service: "backend" });
});

// Track HTTP request metrics
app.use(metricsMiddleware);

// Note: Stripe webhook needs raw body, so we handle it in paymentRoutes before express.json()
// The webhook route uses express.raw() middleware internally
app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());

//AUTH ROUTES
app.use("/api/auth", authRoutes);

//BOOKING ROUTES
app.use("/api/bookings", bookingRoutes);

//MEAL SLOT ROUTES
app.use("/api/meal-slots", mealSlotRoutes);

//TOKEN ROUTES
app.use("/api/tokens", tokenRoutes);

//PAYMENT ROUTES (S.2.3 - No-Show Handling & Token Re-allocation)
app.use("/api/payments", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/menu-items", menuItemRoutes);

//ADMIN ROUTES
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
	logger.info(`Server running at http://localhost:${port}`);
	startMetricsPush();
});
