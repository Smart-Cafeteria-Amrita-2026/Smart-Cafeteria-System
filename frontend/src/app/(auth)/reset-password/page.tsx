import { Suspense } from "react";
import { ResetPasswordFormContainer } from "@/components/auth/ResetPasswordFormContainer";

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
		>
			<ResetPasswordFormContainer />
		</Suspense>
	);
}
