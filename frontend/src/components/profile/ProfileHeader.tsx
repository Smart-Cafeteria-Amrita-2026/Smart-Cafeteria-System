import { User, Mail, Phone, Building2, BadgeCheck } from "lucide-react";

interface Props {
	firstName: string;
	lastName: string;
	email: string;
	collegeId: string;
	mobile?: string | null;
	department?: string | null;
	role: string;
	accountStatus: string;
}

export function ProfileHeader({
	firstName,
	lastName,
	email,
	collegeId,
	mobile,
	department,
	role,
	accountStatus,
}: Props) {
	const fullName = `${firstName} ${lastName}`;
	const isActive = accountStatus === "active";

	return (
		<div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border">
			{/* Decorative background element */}
			<div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-50 opacity-50" />

			<div className="relative space-y-4">
				{/* Main profile info */}
				<div className="flex items-center gap-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200">
						<User size={32} />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
							{isActive && <BadgeCheck size={18} className="text-green-500" />}
						</div>
						<p className="text-sm font-medium text-gray-500 capitalize">{role}</p>
					</div>
				</div>

				{/* Details grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t">
					<div className="flex items-center gap-3 text-sm text-gray-600">
						<Mail size={16} className="text-gray-400" />
						<span className="truncate">{email}</span>
					</div>

					<div className="flex items-center gap-3 text-sm text-gray-600">
						<BadgeCheck size={16} className="text-gray-400" />
						<span>{collegeId}</span>
					</div>

					{mobile && (
						<div className="flex items-center gap-3 text-sm text-gray-600">
							<Phone size={16} className="text-gray-400" />
							<span>{mobile}</span>
						</div>
					)}

					{department && (
						<div className="flex items-center gap-3 text-sm text-gray-600">
							<Building2 size={16} className="text-gray-400" />
							<span>{department}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
