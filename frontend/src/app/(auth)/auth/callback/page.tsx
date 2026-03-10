"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export default function AuthCallbackPage() {
	const router = useRouter();
	const processed = useRef(false);
	const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

	useEffect(() => {
		if (processed.current) return;
		processed.current = true;

		async function handleCallback() {
			try {
				// Supabase automatically parses the hash fragment and sets the session
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error || !session) {
					toast.error("Authentication failed. Please try again.");
					router.replace("/login");
					return;
				}

				// Send tokens to backend to set httpOnly cookies and check profile
				const result = await AuthService.oauthCallback({
					access_token: session.access_token,
					refresh_token: session.refresh_token,
				});

				if (result.data.profileComplete) {
					setAuthenticated(true);
					toast.success("Signed in successfully!");
					router.replace("/");
				} else {
					// Profile incomplete — redirect to register form
					router.replace("/register");
				}
			} catch {
				toast.error("Something went wrong during sign-in.");
				router.replace("/login");
			}
		}

		handleCallback();
	}, [router, setAuthenticated]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center space-y-3">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
				<p className="text-muted-foreground">Completing sign-in...</p>
			</div>
		</div>
	);
}
