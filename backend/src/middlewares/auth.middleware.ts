import type { NextFunction, Request, Response } from "express";
import { public_client } from "../config/supabase";
import type { UserDetails } from "../interfaces/user.types";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.cookies.access_token;
	const refreshToken = req.cookies.refresh_token;

	if (accessToken) {
		const {
			data: { user },
			error,
		} = await public_client.auth.getUser(accessToken);

		if (user && !error && user.email) {
			const userDetails: UserDetails = {
				id: user.id,
				email: user.email,
				role: user.user_metadata.role,
				college_id: user.user_metadata.college_id,
				first_name: user.user_metadata.first_name,
				last_name: user.user_metadata.last_name,
			};
			req.user = userDetails;
			req.token = accessToken;
			return next();
		}
	}

	if (refreshToken) {
		const { data, error } = await public_client.auth.refreshSession({
			refresh_token: refreshToken,
		});

		if (error || !data.session) {
			res.clearCookie("access_token");
			res.clearCookie("refresh_token");
			return res.status(401).json({ error: "Session expired. Please login again." });
		}

		const isProduction = process.env.NODE_ENV === "production";
		const cookieOptions = {
			httpOnly: true,
			secure: isProduction,
			sameSite: "lax" as const,
		};

		res.cookie("access_token", data.session.access_token, {
			...cookieOptions,
			maxAge: 60 * 60 * 1000,
		});

		res.cookie("refresh_token", data.session.refresh_token, {
			...cookieOptions,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		if (data.user?.email) {
			const userDetails: UserDetails = {
				id: data.user.id,
				email: data.user.email,
				role: data.user?.user_metadata.role,
				college_id: data.user?.user_metadata.college_id,
				first_name: data.user?.user_metadata.first_name,
				last_name: data.user?.user_metadata.last_name,
			};
			req.user = userDetails;
			req.token = data.session.access_token;
		}
		return next();
	}

	return res.status(401).json({ error: "Unauthorized: No tokens provided" });
};
