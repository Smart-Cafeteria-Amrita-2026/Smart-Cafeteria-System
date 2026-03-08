import type { Request, Response } from "express";
import { STATUS } from "../interfaces/status.types";
import { getTrendingItems } from "../services/forecastService";

export const getTrendingItemsController = async (_req: Request, res: Response): Promise<void> => {
	try {
		const result = await getTrendingItems();

		if (!result.success) {
			res.status(result.statusCode).json({
				success: false,
				error: result.error,
			});
			return;
		}

		res.status(result.statusCode).json({
			success: true,
			data: result.data,
		});
	} catch (error) {
		res.status(STATUS.SERVERERROR).json({
			success: false,
			error: error instanceof Error ? error.message : "Internal Server Error",
		});
	}
};
