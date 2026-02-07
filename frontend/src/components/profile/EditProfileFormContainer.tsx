"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EditProfileForm } from "./EditProfileForm";
import { useProfile, useUpdateProfile } from "../../hooks/profile/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { ArrowLeft, Loader2 } from "lucide-react";

const editProfileSchema = z.object({
	first_name: z.string().min(2, "First name must be at least 2 characters"),
	last_name: z.string().min(1, "Last name is required"),
	mobile: z
		.string()
		.refine(
			(val) => val === "" || /^[6-9]\d{9}$/.test(val),
			"Mobile number must be exactly 10 digits starting with 6-9"
		),
	department: z.string(),
});

type EditProfileFormValuesInferred = z.infer<typeof editProfileSchema>;

export function EditProfileFormContainer() {
	const router = useRouter();
	const { token, isHydrated } = useAuthStore();
	const { data: profile, isLoading: isProfileLoading } = useProfile();
	const updateProfileMutation = useUpdateProfile();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EditProfileFormValuesInferred>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			mobile: "",
			department: "",
		},
	});

	// Redirect if not authenticated
	useEffect(() => {
		if (isHydrated && !token) {
			router.push("/login?redirect=/profile/edit");
		}
	}, [isHydrated, token, router]);

	// Populate form with profile data
	useEffect(() => {
		if (profile) {
			reset({
				first_name: profile.first_name || "",
				last_name: profile.last_name || "",
				mobile: profile.mobile || "",
				department: profile.department || "",
			});
		}
	}, [profile, reset]);

	const onSubmit = (data: EditProfileFormValuesInferred) => {
		updateProfileMutation.mutate(
			{
				first_name: data.first_name,
				last_name: data.last_name,
				mobile: data.mobile || undefined,
				department: data.department || undefined,
			},
			{
				onSuccess: () => {
					router.push("/profile");
				},
			}
		);
	};

	if (isProfileLoading) {
		return (
			<div className="mx-auto max-w-xl p-4 space-y-6">
				<div className="flex items-center gap-4 mb-6">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						type="button"
					>
						<ArrowLeft size={20} />
					</button>
					<h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
				</div>
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="mx-auto max-w-xl p-4 text-center space-y-4 pt-20">
				<p className="text-red-500 font-medium">Failed to load profile.</p>
				<button
					onClick={() => router.push("/profile")}
					className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
				>
					Return to Profile
				</button>
			</div>
		);
	}

	return (
		<EditProfileForm
			register={register}
			errors={errors}
			onSubmit={handleSubmit(onSubmit)}
			onBack={() => router.back()}
			isLoading={updateProfileMutation.isPending}
			email={profile.email}
			collegeId={profile.college_id}
		/>
	);
}
