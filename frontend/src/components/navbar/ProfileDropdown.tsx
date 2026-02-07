"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/services/auth.service";
import { User, LogOut, ReceiptText, BookCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export function ProfileDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const logout = useAuthStore((s) => s.logout);

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
			logout();
			setIsOpen(false);
			toast.success("Logged out successfully");
			router.push("/");
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-100 bg-white text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm overflow-hidden"
				aria-label="User menu"
			>
				<div className="flex h-full w-full items-center justify-center bg-blue-50">
					<User size={20} />
				</div>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
					<div className="px-3 py-2 border-b mb-1">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
					</div>

					<Link
						href="/profile"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
						onClick={() => setIsOpen(false)}
					>
						<User size={18} />
						My Profile
					</Link>

					<Link
						href="/profile/edit"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
						onClick={() => setIsOpen(false)}
					>
						<User size={18} className="text-gray-400" />
						Edit Profile
					</Link>

					<div className="px-3 py-2 border-b my-1 mt-2">
						<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Activity</p>
					</div>

					<Link
						href="/profile#bookings"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
						onClick={() => setIsOpen(false)}
					>
						<BookCheck size={18} />
						Bookings
					</Link>

					<Link
						href="/profile#transactions"
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
						onClick={() => setIsOpen(false)}
					>
						<ReceiptText size={18} />
						Transactions
					</Link>

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
