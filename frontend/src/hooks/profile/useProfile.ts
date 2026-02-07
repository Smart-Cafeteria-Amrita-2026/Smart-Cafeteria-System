import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { ProfileService } from "../../services/profile/ProfileService";
import type { UserProfile, UpdateProfilePayload } from "../../types/profile/profile.types";

export function useProfile() {
	return useQuery<UserProfile>({
		queryKey: ["profile"],
		queryFn: ProfileService.getProfile,
		staleTime: 5 * 60 * 1000,
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateProfilePayload) => ProfileService.updateProfile(payload),
		onSuccess: () => {
			toast.success("Profile updated successfully!");
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
		onError: () => {
			toast.error("Failed to update profile.");
		},
	});
}
