"use client";

import { useState } from "react";
import Link from "next/link";
import { UseFormRegister } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";
import type { ResetPasswordFormValues } from "@/validations/auth.schemas";

interface ResetPasswordFormProps {
	register: UseFormRegister<ResetPasswordFormValues>;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	errors: {
		new_password?: string;
		confirm_password?: string;
	};
	passwordValue?: string;
	confirmPasswordValue?: string;
}

function getPasswordWarning(password: string) {
	if (!password) return null;
	if (password.length < 8) return "Password must be at least 8 characters";
	if (!/[A-Z]/.test(password)) return "Password must contain one uppercase letter";
	if (!/[0-9]/.test(password)) return "Password must contain one number";
	if (!/[@$!%*?&#]/.test(password)) return "Password must contain one special character";
	return null;
}

export function ResetPasswordForm({
	register,
	onSubmit,
	isLoading,
	errors,
	passwordValue = "",
	confirmPasswordValue = "",
}: ResetPasswordFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const passwordWarning = getPasswordWarning(passwordValue);
	const confirmWarning =
		confirmPasswordValue && passwordValue !== confirmPasswordValue
			? "Passwords do not match"
			: null;

	return (
		<>
			<AuthHeader
				title="Reset Password"
				subtitle="Enter your new password"
				illustrationSrc="/assets/auth/reset-password-illustration.jpg"
			/>

			<form onSubmit={onSubmit} className="space-y-5">
				{/* New Password */}
				<div className="space-y-1">
					<Label>New Password</Label>
					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							{...register("new_password")}
							className="pr-10"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>

					{/* 🔴 Live password warning */}
					{passwordWarning && <p className="text-sm text-destructive">{passwordWarning}</p>}
				</div>

				{/* Confirm Password */}
				<div className="space-y-1">
					<Label>Confirm Password</Label>
					<div className="relative">
						<Input
							type={showConfirm ? "text" : "password"}
							{...register("confirm_password")}
							className="pr-10"
						/>
						<button
							type="button"
							onClick={() => setShowConfirm((v) => !v)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						>
							{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>

					{confirmWarning && <p className="text-sm text-destructive">{confirmWarning}</p>}
				</div>

				<Button
					type="submit"
					className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
					disabled={isLoading}
				>
					{isLoading ? "Resetting..." : "Reset Password"}
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				Remembered your password?{" "}
				<Link href="/login" className="text-primary font-medium">
					Login
				</Link>
			</p>
		</>
	);
}
