import type { NextFunction, Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		return res.status(STATUS.UNAUTHORIZED).json({ error: "User not authenticated" });
	}

	if (req.user.role !== "admin") {
		return res.status(STATUS.FORBIDDEN).json({ error: "Admin access required" });
	}

	return next();
};
