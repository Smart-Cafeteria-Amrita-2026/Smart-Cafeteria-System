import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;
const supabaseAnonKey = process.env.SUPABASE_KEY_ANON;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
	throw new Error("Missing Supabase URL or Service Role Key in .env");
}

export const getAuthenticatedClient = (token: string) => {
	return createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	});
};

export const service_client = createClient(supabaseUrl, supabaseServiceKey);
export const public_client = createClient(supabaseUrl, supabaseAnonKey);
