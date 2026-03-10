import "../styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { Navbar } from "@/components/navbar/Navbar";
import { BlockedAccountGuard } from "@/components/blocked/BlockedAccountGuard";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Staff Dashboard",
	description: "Staff dashboard for canteen management",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ReactQueryProvider>
					<Toaster position="top-right" richColors closeButton />
					<BlockedAccountGuard>
						<Navbar />
						<main className="pt-24">{children}</main>
					</BlockedAccountGuard>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
