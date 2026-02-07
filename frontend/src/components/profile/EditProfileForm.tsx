import { Save, ArrowLeft } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

export interface EditProfileFormValues {
	first_name: string;
	last_name: string;
	mobile: string;
	department: string;
}

interface Props {
	register: UseFormRegister<EditProfileFormValues>;
	errors: FieldErrors<EditProfileFormValues>;
	onSubmit: (e: React.FormEvent) => void;
	onBack: () => void;
	isLoading?: boolean;
	email: string;
	collegeId: string;
}

export function EditProfileForm({
	register,
	errors,
	onSubmit,
	onBack,
	isLoading,
	email,
	collegeId,
}: Props) {
	return (
		<div className="mx-auto max-w-xl p-4 space-y-6">
			<div className="flex items-center gap-4 mb-6">
				<button
					onClick={onBack}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					type="button"
				>
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
			</div>

			<form onSubmit={onSubmit} className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
				{/* Read-only fields */}
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-semibold text-gray-700">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						value={email}
						className="w-full rounded-xl border p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
						disabled
					/>
					<p className="text-xs text-gray-400">Email cannot be changed</p>
				</div>

				<div className="space-y-2">
					<label htmlFor="collegeId" className="text-sm font-semibold text-gray-700">
						College ID
					</label>
					<input
						id="collegeId"
						type="text"
						value={collegeId}
						className="w-full rounded-xl border p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
						disabled
					/>
					<p className="text-xs text-gray-400">College ID cannot be changed</p>
				</div>

				{/* Editable fields */}
				<div className="space-y-2">
					<label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
						First Name
					</label>
					<input
						id="firstName"
						type="text"
						{...register("first_name")}
						className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						disabled={isLoading}
					/>
					{errors.first_name && (
						<p className="text-xs text-red-500">{String(errors.first_name.message)}</p>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
						Last Name
					</label>
					<input
						id="lastName"
						type="text"
						{...register("last_name")}
						className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						disabled={isLoading}
					/>
					{errors.last_name && (
						<p className="text-xs text-red-500">{String(errors.last_name.message)}</p>
					)}
				</div>

				<div className="space-y-2">
					<label htmlFor="mobile" className="text-sm font-semibold text-gray-700">
						Mobile Number
					</label>
					<input
						id="mobile"
						type="tel"
						{...register("mobile")}
						placeholder="10-digit mobile number"
						className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						disabled={isLoading}
					/>
					{errors.mobile && <p className="text-xs text-red-500">{String(errors.mobile.message)}</p>}
				</div>

				<div className="space-y-2">
					<label htmlFor="department" className="text-sm font-semibold text-gray-700">
						Department
					</label>
					<input
						id="department"
						type="text"
						{...register("department")}
						placeholder="e.g., Computer Science"
						className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						disabled={isLoading}
					/>
					{errors.department && (
						<p className="text-xs text-red-500">{String(errors.department.message)}</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					<Save size={20} />
					{isLoading ? "Saving..." : "Save Changes"}
				</button>
			</form>
		</div>
	);
}
