import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from "./routes/bookingRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//AUTH ROUTES
app.use("/api/auth", authRoutes);

//BOOKING ROUTES
app.use("/api/bookings", bookingRoutes);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
