import { apiGet, apiPut } from "@/lib/api";
import type {
	UserProfile,
	UpdateProfilePayload,
	ProfileResponse,
} from "../../types/profile/profile.types";

export const ProfileService = {
	getProfile: async (): Promise<UserProfile> => {
		const response = await apiGet<ProfileResponse>("api/auth/profile");
		return response.data;
	},

	updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
		const response = await apiPut<ProfileResponse>("api/auth/profile", payload);
		return response.data;
	},
};
