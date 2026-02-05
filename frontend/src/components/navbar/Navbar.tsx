'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/auth.store';
import { ProfileDropdown } from './ProfileDropdown';

export function Navbar() {
    const router = useRouter();

    const { token, isHydrated, logout } = useAuthStore();

    // Prevent flicker before Zustand rehydrates
    if (!isHydrated) {
        return null;
    }

    const isLoggedIn = Boolean(token);

    return (
        <nav className="sticky top-0 z-50 border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* Logo / Brand */}
                <Link
                    href="/"
                    className="text-lg font-semibold text-blue-600"
                >
                    Smart Cafeteria
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn && (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {isLoggedIn && (
                        <div className="flex items-center gap-4">
                            <ProfileDropdown />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
