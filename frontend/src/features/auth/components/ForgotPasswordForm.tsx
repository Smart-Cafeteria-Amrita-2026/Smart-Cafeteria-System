import Link from "next/link";
import { UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";

interface ForgotPasswordFormValues {
	email: string;
}

interface ForgotPasswordFormProps {
	register: UseFormRegister<ForgotPasswordFormValues>;
	onSubmit: () => void;
	isLoading: boolean;
	error?: string;
}

export function ForgotPasswordForm({
	register,
	onSubmit,
	isLoading,
	error,
}: ForgotPasswordFormProps) {
	return (
		<>
			<AuthHeader
				title="Forgot your password?"
				subtitle="Enter your email and we’ll send you a reset code"
				illustrationSrc="/assets/auth/forgot-password-illustration.jpg"
			/>

			<form onSubmit={onSubmit} className="space-y-5">
				{/* Email */}
				<div className="space-y-1">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						className="h-11 sm:h-12"
						{...register("email")}
					/>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}

				{/* Submit */}
				<Button
					type="submit"
					className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
					disabled={isLoading}
				>
					{isLoading ? "Sending..." : "Send reset code"}
				</Button>
			</form>

			{/* Back to login */}
			<p className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
				Remembered your password?{" "}
				<Link href="/login" className="text-primary font-medium">
					Back to login
				</Link>
			</p>
		</>
	);
}
