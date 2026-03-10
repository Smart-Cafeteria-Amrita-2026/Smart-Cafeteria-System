"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import {
	User,
	LogOut,
	ReceiptText,
	BookCheck,
	Package,
	BarChart3,
	UtensilsCrossed,
	Shield,
	Users,
	ClipboardList,
	ExternalLink,
	LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { resetClientSession } from "@/lib/session";

export function ProfileDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const queryClient = useQueryClient();
	const { isStaff, isAdmin } = useRole();

	// Close when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await AuthService.logout();
		} catch (error) {
			// Continue with logout even if backend call fails
			console.warn("Backend logout failed:", error);
		} finally {
			resetClientSession(queryClient);
			setIsOpen(false);
			toast.success("Logged out successfully");
			router.replace("/login");
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
					isAdmin
						? "border-orange-200 bg-orange-50 text-orange-600 hover:border-orange-300 hover:bg-orange-100"
						: "border-orange-100 bg-white text-orange-500 hover:border-orange-200 hover:bg-orange-50"
				} transition-all shadow-sm overflow-hidden`}
				aria-label="User menu"
			>
				<div
					className={`flex h-full w-full items-center justify-center ${isAdmin ? "bg-orange-100" : "bg-orange-50"}`}
				>
					{isAdmin ? <Shield size={20} /> : <User size={20} />}
				</div>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
					<div className="px-3 py-2 border-b mb-1">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
					</div>

					<Link
						href="/profile"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
						onClick={() => setIsOpen(false)}
					>
						<User size={18} />
						My Profile
					</Link>

					<div className="px-3 py-2 border-b my-1 mt-2">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
							{isAdmin ? "Admin Tools" : isStaff ? "Staff Tools" : "Activity"}
						</p>
					</div>

					{isAdmin ? (
						<>
							<Link
								href="/admin"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<LayoutDashboard size={18} />
								Dashboard
							</Link>

							<Link
								href="/admin/users"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<Users size={18} />
								User Management
							</Link>

							<Link
								href="/admin/audit-logs"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<ClipboardList size={18} />
								Audit Logs
							</Link>

							{process.env.NEXT_PUBLIC_GRAFANA_URL && (
								<a
									href={process.env.NEXT_PUBLIC_GRAFANA_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
									onClick={() => setIsOpen(false)}
								>
									<ExternalLink size={18} />
									Grafana Monitoring
								</a>
							)}
						</>
					) : isStaff ? (
						<>
							<Link
								href="/staff/menu"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<UtensilsCrossed size={18} />
								Menu
							</Link>

							<Link
								href="/staff/inventory"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<Package size={18} />
								Inventory
							</Link>

							<Link
								href="/staff/forecast"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<BarChart3 size={18} />
								Forecaster
							</Link>
						</>
					) : (
						<>
							<Link
								href="/my-bookings"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<BookCheck size={18} />
								My Bookings
							</Link>

							<Link
								href="/transaction-history"
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<ReceiptText size={18} />
								Transaction History
							</Link>
						</>
					)}

					<div className="my-2 border-t" />

					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
					>
						<LogOut size={18} />
						{isLoggingOut ? "Logging out..." : "Logout"}
					</button>
				</div>
			)}
		</div>
	);
}
