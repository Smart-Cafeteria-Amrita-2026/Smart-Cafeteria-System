import type { NextFunction, Request, Response } from "express";
import { public_client, service_client } from "../config/supabase";
import type { UserDetails } from "../interfaces/user.types";

/**
 * Build UserDetails from the auth user + optional public.users profile.
 * OAuth users may not yet have a public.users record (profile incomplete).
 */
async function buildUserDetails(userId: string, email: string): Promise<UserDetails> {
	const { data: profile } = await service_client
		.from("users")
		.select("college_id, first_name, last_name, role")
		.eq("id", userId)
		.single();

	return {
		id: userId,
		email,
		role: profile?.role ?? "",
		college_id: profile?.college_id ?? "",
		first_name: profile?.first_name ?? "",
		last_name: profile?.last_name ?? "",
	};
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.cookies.access_token;
	const refreshToken = req.cookies.refresh_token;

	if (accessToken) {
		const {
			data: { user },
			error,
		} = await public_client.auth.getUser(accessToken);

		if (user && !error && user.email) {
			req.user = await buildUserDetails(user.id, user.email);
			req.token = accessToken;
			return next();
		}
	}

	if (refreshToken) {
		const isProduction = process.env.NODE_ENV === "production";

		const { data, error } = await public_client.auth.refreshSession({
			refresh_token: refreshToken,
		});

		const sameSite: "none" | "lax" = isProduction ? "none" : "lax";

		if (error || !data.session) {
			res.clearCookie("access_token", {
				httpOnly: true,
				secure: isProduction,
				sameSite,
			});
			res.clearCookie("refresh_token", {
				httpOnly: true,
				secure: isProduction,
				sameSite,
			});
			return res.status(401).json({ error: "Session expired. Please login again." });
		}

		const cookieOptions = {
			httpOnly: true,
			secure: isProduction,
			sameSite,
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
			req.user = await buildUserDetails(data.user.id, data.user.email);
			req.token = data.session.access_token;
		}
		return next();
	}

	return res.status(401).json({ error: "Unauthorized: No tokens provided" });
};
