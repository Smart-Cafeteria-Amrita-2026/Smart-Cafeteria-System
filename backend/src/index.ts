import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";

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
app.use(express.json());
app.use(cookieParser());

//AUTH ROUTES
app.use("/api/auth", authRoutes);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
