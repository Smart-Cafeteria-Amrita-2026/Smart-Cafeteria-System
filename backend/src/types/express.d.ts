import { UserDetails } from "../interfaces/user.types";

declare global {
	namespace Express {
		interface Request {
			user?: UserDetails;
			token?: string;
		}
	}
}
