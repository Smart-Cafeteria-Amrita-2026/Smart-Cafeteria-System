"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
	const { token, isHydrated } = useAuthStore();

	// Prevent flicker before Zustand rehydrates
	if (!isHydrated) {
		return null;
	}

	const isLoggedIn = Boolean(token);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
			<nav className="mx-auto max-w-6xl rounded-2xl border border-white/20 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300">
				<div className="flex items-center justify-between px-4 py-3 sm:px-6">
					{/* Logo / Brand */}
					<Link
						href="/"
						className="group flex items-center gap-2 text-lg font-bold text-blue-600 transition-all duration-300 hover:text-blue-700 sm:text-xl"
					>
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
							SC
						</span>
						<span className="hidden sm:inline">Smart Cafeteria</span>
					</Link>

					{/* Right side */}
					<div className="flex items-center gap-2 sm:gap-4">
						{!isLoggedIn && (
							<>
								<Link
									href="/login"
									className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-blue-600 sm:px-4"
								>
									Login
								</Link>

								<Link
									href="/register"
									className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/30 sm:px-5"
								>
									Register
								</Link>
							</>
						)}

						{isLoggedIn && <ProfileDropdown />}
					</div>
				</div>
			</nav>
		</header>
	);
}
