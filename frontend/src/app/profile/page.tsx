"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth.store";
import { useProfile, useUpdateProfile } from "@/hooks/profile/useProfile";
import { useRole } from "@/hooks/useRole";
import { resetClientSession } from "@/lib/session";
import { ProfileHeaderSkeleton } from "@/components/profile/ProfileHeaderSkeleton";
import { WalletDashboard } from "@/components/wallet/WalletDashboard";
import {
	ArrowLeft,
	Wallet,
	ChevronDown,
	ChevronUp,
	User,
	Mail,
	Phone,
	Building2,
	BadgeCheck,
	Pencil,
	Save,
	X,
} from "lucide-react";

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

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function ProfilePage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { token, isHydrated } = useAuthStore();
	const { data: profile, isLoading, error } = useProfile();
	const updateProfileMutation = useUpdateProfile();
	const { isStaff } = useRole();

	const [isEditing, setIsEditing] = useState(false);
	const [isWalletOpen, setIsWalletOpen] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			mobile: "",
			department: "",
		},
	});

	// Redirect guest users
	useEffect(() => {
		if (isHydrated && !token) {
			router.replace("/login");
		}
	}, [isHydrated, token, router]);

	// Populate form when profile loads or editing starts
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

	const handleLogout = () => {
		resetClientSession(queryClient);
		router.replace("/login");
	};

	if (isHydrated && !token) {
		return null;
	}

	const handleEditToggle = () => {
		if (isEditing) {
			// Cancel editing — reset form to current profile values
			if (profile) {
				reset({
					first_name: profile.first_name || "",
					last_name: profile.last_name || "",
					mobile: profile.mobile || "",
					department: profile.department || "",
				});
			}
		}
		setIsEditing(!isEditing);
	};

	const onSubmit = (data: EditProfileFormValues) => {
		updateProfileMutation.mutate(
			{
				first_name: data.first_name,
				last_name: data.last_name,
				mobile: data.mobile || undefined,
				department: data.department || undefined,
			},
			{
				onSuccess: () => {
					setIsEditing(false);
				},
			}
		);
	};

	if (error) {
		return (
			<div className="mx-auto max-w-2xl p-4 text-center space-y-4 pt-20">
				<p className="text-red-500 font-medium">Failed to load profile. Please try again.</p>
				<button
					onClick={() => router.push("/login")}
					className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold shadow-lg hover:bg-[var(--color-primary)] transition-all"
				>
					Return to Login
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-4 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
				>
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
			</div>

			{/* Profile Info Card */}
			{isLoading ? (
				<ProfileHeaderSkeleton />
			) : profile ? (
				<div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border">
					{/* Decorative background */}
					<div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[var(--color-primary)] opacity-30 pointer-events-none" />

					<div className="relative">
						{/* Top row: avatar + name + edit button */}
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)] text-white shadow-lg shadow-blue-200">
									<User size={32} />
								</div>
								<div>
									{!isEditing ? (
										<>
											<div className="flex items-center gap-2">
												<h2 className="text-xl font-bold text-gray-900">
													{profile.first_name} {profile.last_name}
												</h2>
												{profile.account_status === "active" && (
													<BadgeCheck size={18} className="text-green-500" />
												)}
											</div>
											<p className="text-sm font-medium text-gray-500 capitalize">{profile.role}</p>
										</>
									) : (
										<div className="flex flex-col sm:flex-row gap-2">
											<div>
												<input
													type="text"
													{...register("first_name")}
													className="w-full rounded-lg border px-3 py-1.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
													placeholder="First Name"
													disabled={updateProfileMutation.isPending}
												/>
												{errors.first_name && (
													<p className="text-xs text-red-500 mt-0.5">
														{String(errors.first_name.message)}
													</p>
												)}
											</div>
											<div>
												<input
													type="text"
													{...register("last_name")}
													className="w-full rounded-lg border px-3 py-1.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
													placeholder="Last Name"
													disabled={updateProfileMutation.isPending}
												/>
												{errors.last_name && (
													<p className="text-xs text-red-500 mt-0.5">
														{String(errors.last_name.message)}
													</p>
												)}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Edit / Cancel button */}
							<button
								type="button"
								onClick={handleEditToggle}
								className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors z-10 bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-dark)] hover:shadow-lg`}
								title="Edit Profile"
							>
								{isEditing ? (
									<>
										<X size={16} />
										Cancel
									</>
								) : (
									<>
										<Pencil size={16} />
										Edit Profile
									</>
								)}
							</button>
						</div>

						{/* Details grid */}
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 mt-4 border-t">
								{/* Email — always read-only */}
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<Mail size={16} className="shrink-0 text-gray-400" />
									<span className="truncate">{profile.email}</span>
								</div>

								{/* College ID — always read-only */}
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<BadgeCheck size={16} className="shrink-0 text-gray-400" />
									<span>{profile.college_id}</span>
								</div>

								{/* Mobile */}
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<Phone size={16} className="shrink-0 text-gray-400" />
									{isEditing ? (
										<div className="w-full">
											<input
												type="tel"
												{...register("mobile")}
												className="w-full rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="10-digit mobile number"
												disabled={updateProfileMutation.isPending}
											/>
											{errors.mobile && (
												<p className="text-xs text-red-500 mt-0.5">
													{String(errors.mobile.message)}
												</p>
											)}
										</div>
									) : (
										<span>{profile.mobile || "Not set"}</span>
									)}
								</div>

								{/* Department */}
								<div className="flex items-center gap-3 text-sm text-gray-600">
									<Building2 size={16} className="shrink-0 text-gray-400" />
									{isEditing ? (
										<div className="w-full">
											<input
												type="text"
												{...register("department")}
												className="w-full rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
												placeholder="e.g., Computer Science"
												disabled={updateProfileMutation.isPending}
											/>
											{errors.department && (
												<p className="text-xs text-red-500 mt-0.5">
													{String(errors.department.message)}
												</p>
											)}
										</div>
									) : (
										<span>{profile.department || "Not set"}</span>
									)}
								</div>
							</div>

							{/* Save button (only when editing) */}
							{isEditing && (
								<div className="mt-4 pt-4 border-t">
									<button
										type="submit"
										disabled={updateProfileMutation.isPending}
										className="flex w-full sm:w-auto items-centerjustify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-bold text-white hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50"
									>
										<Save size={18} />
										{updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
									</button>
								</div>
							)}
						</form>
					</div>
				</div>
			) : null}

			{/* Wallet Section - Hidden for staff users */}
			{!isStaff && (
				<section className="overflow-hidden rounded-xl border bg-white shadow-sm">
					<button
						onClick={() => setIsWalletOpen(!isWalletOpen)}
						className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
					>
						<div className="flex items-center gap-3">
							<div className="p-2 bg-[var(--color-secondary)] text-[var(--color-secondary)] rounded-lg">
								<Wallet size={20} />
							</div>
							<span className="font-semibold text-gray-900">Personal Wallet</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-gray-900 italic">
								₹{profile?.wallet_balance?.toFixed(2) ?? "0.00"}
							</span>
							{isWalletOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
						</div>
					</button>
					{isWalletOpen && (
						<div className="border-t">
							<WalletDashboard />
						</div>
					)}
				</section>
			)}

			{/* Logout */}
			<button
				onClick={handleLogout}
				className="w-full mt-8 rounded-xl bg-red-50 p-4 text-center font-semibold text-red-600 hover:bg-red-100 transition-colors"
			>
				Log Out
			</button>
		</div>
	);
}
