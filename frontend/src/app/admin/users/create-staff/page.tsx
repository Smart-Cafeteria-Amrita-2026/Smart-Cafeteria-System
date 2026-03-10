"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useCreateStaff } from "@/hooks/admin/useAdmin";
import type { CreateStaffPayload } from "@/types/admin.types";

export default function CreateStaffPage() {
	const router = useRouter();
	const createStaff = useCreateStaff();

	const [form, setForm] = useState<CreateStaffPayload>({
		email: "",
		first_name: "",
		last_name: "",
		college_id: "",
		mobile: "",
		department: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!form.email.trim()) newErrors.email = "Email is required";
		else if (!form.email.endsWith("@gmail.com")) newErrors.email = "Must be a @gmail.com address";

		if (!form.first_name.trim()) newErrors.first_name = "First name is required";
		if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
		if (!form.college_id.trim()) newErrors.college_id = "College ID is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const payload: CreateStaffPayload = {
			email: form.email,
			first_name: form.first_name,
			last_name: form.last_name,
			college_id: form.college_id,
		};
		if (form.mobile?.trim()) payload.mobile = form.mobile;
		if (form.department?.trim()) payload.department = form.department;

		createStaff.mutate(payload, {
			onSuccess: () => router.push("/admin/users"),
		});
	};

	const handleChange = (field: keyof CreateStaffPayload, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]">
			{/* Header */}
			<div className="container mx-auto px-4 pt-8 pb-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<Link
						href="/admin/users"
						className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30 transition"
					>
						<ArrowLeft size={20} />
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-white sm:text-3xl">Create Staff Account</h1>
						<p className="text-sm text-white/80">Add a new staff member to the system</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 max-w-2xl">
				<form
					onSubmit={handleSubmit}
					className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg space-y-5"
				>
					{/* Email */}
					<div>
						<label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
							Email Address *
						</label>
						<input
							id="email"
							type="email"
							value={form.email}
							onChange={(e) => handleChange("email", e.target.value)}
							placeholder="staff@gmail.com"
							className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
								errors.email
									? "border-red-300 focus:ring-2 focus:ring-red-100"
									: "border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
							}`}
						/>
						{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
					</div>

					{/* Name Row */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label
								htmlFor="first_name"
								className="block text-sm font-semibold text-gray-700 mb-1.5"
							>
								First Name *
							</label>
							<input
								id="first_name"
								type="text"
								value={form.first_name}
								onChange={(e) => handleChange("first_name", e.target.value)}
								placeholder="John"
								className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
									errors.first_name
										? "border-red-300 focus:ring-2 focus:ring-red-100"
										: "border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
								}`}
							/>
							{errors.first_name && (
								<p className="text-xs text-red-500 mt-1">{errors.first_name}</p>
							)}
						</div>
						<div>
							<label
								htmlFor="last_name"
								className="block text-sm font-semibold text-gray-700 mb-1.5"
							>
								Last Name *
							</label>
							<input
								id="last_name"
								type="text"
								value={form.last_name}
								onChange={(e) => handleChange("last_name", e.target.value)}
								placeholder="Doe"
								className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
									errors.last_name
										? "border-red-300 focus:ring-2 focus:ring-red-100"
										: "border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
								}`}
							/>
							{errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
						</div>
					</div>

					{/* College ID */}
					<div>
						<label
							htmlFor="college_id"
							className="block text-sm font-semibold text-gray-700 mb-1.5"
						>
							College ID *
						</label>
						<input
							id="college_id"
							type="text"
							value={form.college_id}
							onChange={(e) => handleChange("college_id", e.target.value)}
							placeholder="STAFF001"
							className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
								errors.college_id
									? "border-red-300 focus:ring-2 focus:ring-red-100"
									: "border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
							}`}
						/>
						{errors.college_id && <p className="text-xs text-red-500 mt-1">{errors.college_id}</p>}
					</div>

					{/* Optional Fields */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-1.5">
								Mobile
							</label>
							<input
								id="mobile"
								type="text"
								value={form.mobile || ""}
								onChange={(e) => handleChange("mobile", e.target.value)}
								placeholder="9876543210"
								className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
							/>
						</div>
						<div>
							<label
								htmlFor="department"
								className="block text-sm font-semibold text-gray-700 mb-1.5"
							>
								Department
							</label>
							<input
								id="department"
								type="text"
								value={form.department || ""}
								onChange={(e) => handleChange("department", e.target.value)}
								placeholder="Kitchen"
								className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={createStaff.isPending}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition disabled:opacity-50"
					>
						<UserPlus size={18} />
						{createStaff.isPending ? "Creating..." : "Create Staff Account"}
					</button>
				</form>
			</div>
		</div>
	);
}
