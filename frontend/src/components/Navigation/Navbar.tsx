"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Settings,
	User,
	LogOut,
	Home,
	BarChart3,
	Package,
	ClipboardList,
	Users,
	Plus,
} from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
	const pathname = usePathname();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);

	const navItems = [
		{ name: "Dashboard", path: "/staff" },
		{ name: "Forecast", path: "/staff/forecast" },
		{ name: "Inventory", path: "/staff/inventory" },
	];

	const iconMap = {
		"/staff": <Home size={20} />,
		"/staff/forecast": <BarChart3 size={20} />,
		"/staff/inventory": <Package size={20} />,
	};

	const isActive = (path: string) => {
		if (path === "/staff") {
			return pathname === path;
		}
		return pathname?.startsWith(path);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
				setIsProfileOpen(false);
			}
		}

		// Add event listener
		document.addEventListener("mousedown", handleClickOutside);

		// Cleanup
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Close dropdown on escape key
	useEffect(() => {
		function handleEscapeKey(event: KeyboardEvent) {
			if (event.key === "Escape" && isProfileOpen) {
				setIsProfileOpen(false);
			}
		}

		document.addEventListener("keydown", handleEscapeKey);
		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isProfileOpen]);

	const toggleProfile = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	const closeProfile = () => {
		setIsProfileOpen(false);
	};

	const handleLogout = () => {
		// Add your logout logic here
		console.log("Logging out...");
		// Example: router.push('/login');
	};

	return (
		<nav className={styles.navbar}>
			<div className={styles.container}>
				{/* Logo */}
				<div className={styles.logoSection}>
					<Link href="/staff" className={styles.logo}>
						<ClipboardList size={24} />
						<span className={styles.logoText}>Staff Portal</span>
					</Link>

					{/* Quick Actions */}
					<div className={styles.quickActions}>
						<Link
							href="/staff/walk-in"
							className={styles.quickActionButton}
							title="Walk-in Booking"
							onClick={closeProfile}
						>
							<Users size={16} />
							<span>Walk-in</span>
						</Link>
						<Link
							href="/staff?create-slot=true"
							className={styles.quickActionButton}
							title="Create Slot"
							onClick={closeProfile}
						>
							<Plus size={16} />
							<span>Slot</span>
						</Link>
					</div>
				</div>

				{/* Navigation Links */}
				<div className={styles.navSection}>
					{navItems.map((item) => {
						const active = isActive(item.path);
						const icon = iconMap[item.path as keyof typeof iconMap] || <Home size={20} />;

						return (
							<Link
								key={item.name}
								href={item.path}
								className={`${styles.navLink} ${active ? styles.active : ""}`}
								title={item.name}
								onClick={closeProfile}
							>
								{icon}
								<span className={styles.navText}>{item.name}</span>
								{active && <div className={styles.activeIndicator} />}
							</Link>
						);
					})}
				</div>

				{/* Right Section */}
				<div className={styles.rightSection}>
					{/* Settings */}
					<Link
						href="/staff/settings"
						className={styles.iconButton}
						title="Settings"
						onClick={closeProfile}
					>
						<Settings size={20} />
					</Link>

					{/* Profile Dropdown */}
					<div className={styles.profileDropdown} ref={profileRef}>
						<button
							className={`${styles.profileButton} ${isProfileOpen ? styles.active : ""}`}
							onClick={toggleProfile}
							aria-expanded={isProfileOpen}
							aria-label="Profile menu"
						>
							<div className={styles.avatar}>
								<User size={20} />
							</div>
							<span className={styles.profileName}>Staff User</span>
						</button>

						{isProfileOpen && (
							<div className={styles.dropdownMenu}>
								<Link href="/staff/profile" className={styles.dropdownItem} onClick={closeProfile}>
									<User size={16} />
									<span>Profile</span>
								</Link>
								<Link href="/staff/settings" className={styles.dropdownItem} onClick={closeProfile}>
									<Settings size={16} />
									<span>Settings</span>
								</Link>
								<div className={styles.dropdownDivider} />
								<button
									className={`${styles.dropdownItem} ${styles.logoutItem}`}
									onClick={() => {
										closeProfile();
										handleLogout();
									}}
								>
									<LogOut size={16} />
									<span>Logout</span>
								</button>
							</div>
						)}
					</div>

					{/* Logout Button - Desktop (Optional) */}
					<button className={styles.logoutButton} title="Logout" onClick={handleLogout}>
						<LogOut size={20} />
					</button>
				</div>
			</div>
		</nav>
	);
}
