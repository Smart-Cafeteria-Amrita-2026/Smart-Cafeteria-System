"use client";

import { ShieldOff, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/services/auth.service";
import { useQueryClient } from "@tanstack/react-query";

export function BlockedAccountScreen() {
	const logout = useAuthStore((s) => s.logout);
	const queryClient = useQueryClient();

	const handleLogout = async () => {
		try {
			await AuthService.logout();
		} finally {
			logout();
			queryClient.clear();
			window.location.href = "/login";
		}
	};

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fff5e1]">
			<div className="mx-4 w-full max-w-md text-center">
				{/* Icon */}
				<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
					<ShieldOff className="h-10 w-10 text-red-500" strokeWidth={1.5} />
				</div>

				{/* Heading */}
				<h1 className="mb-2 text-2xl font-bold text-[#3a2e2a]">Account Blocked</h1>

				{/* Message */}
				<p className="mb-6 text-[#6b4f3b]">
					Your account has been blocked and you can no longer access Smart Cafeteria services. If
					you believe this is a mistake, please contact the cafeteria administration for assistance.
				</p>

				{/* Card with details */}
				<div className="mb-8 rounded-2xl border border-[#f1d6b8] bg-white p-6 shadow-sm">
					<p className="text-sm font-medium text-[#6b4f3b]">Need help?</p>
					<p className="mt-1 text-sm text-[#6b4f3b]/70">
						Reach out to the admin office or email the cafeteria support team to resolve this issue.
					</p>
				</div>

				{/* Logout button */}
				<button
					type="button"
					onClick={handleLogout}
					className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all duration-300 hover:from-orange-500 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/30"
				>
					<LogOut className="h-4 w-4" />
					Sign Out
				</button>
			</div>
		</div>
	);
}
