import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import paymentRoutes from "./routes/paymentRoutes";

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

// Note: Stripe webhook needs raw body, so we handle it in paymentRoutes before express.json()
// The webhook route uses express.raw() middleware internally
app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());

//AUTH ROUTES
app.use("/api/auth", authRoutes);

//BOOKING ROUTES
app.use("/api/bookings", bookingRoutes);

//TOKEN ROUTES
app.use("/api/tokens", tokenRoutes);

//PAYMENT ROUTES (S.2.3 - No-Show Handling & Token Re-allocation)
app.use("/api/payments", paymentRoutes);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
