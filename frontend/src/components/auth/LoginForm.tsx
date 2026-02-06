"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";

interface LoginFormProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const emailWarning =
		email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address" : null;

	const passwordWarning = password.length === 0 && email ? "Password is required" : null;

	return (
		<>
			{/* Header with illustration */}
			<AuthHeader
				title="Sign in"
				subtitle="Enter your credentials to continue"
				illustrationSrc="/assets/auth/login-illustration.jpg"
			/>

			{/* Login form */}
			<form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
				{/* Email */}
				<div className="space-y-1">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="you@example.com"
						className="h-11 sm:h-12"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					{emailWarning && <p className="text-sm text-destructive">{emailWarning}</p>}
				</div>

				{/* Password */}
				<div className="space-y-1">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						className="h-11 sm:h-12"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{passwordWarning && <p className="text-sm text-destructive">{passwordWarning}</p>}
				</div>

				{/* Forgot password */}
				<div className="text-right">
					<Link
						href="/forgot-password"
						className="text-sm sm:text-base text-primary hover:underline"
					>
						Forgot password?
					</Link>
				</div>

				{/* Submit */}
				<Button
					type="submit"
					className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
					disabled={isLoading}
				>
					{isLoading ? "Signing in..." : "Login"}
				</Button>
			</form>

			{/* Footer */}
			<p className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
				Don’t have an account?{" "}
				<Link href="/register" className="text-primary font-medium">
					Sign up
				</Link>
			</p>
		</>
	);
}
