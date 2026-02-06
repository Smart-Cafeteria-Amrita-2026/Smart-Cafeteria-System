"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import type { RegisterFormValues } from "@/validations/auth.schemas";

interface RegisterFormProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	register: UseFormRegister<RegisterFormValues>;
	errors: FieldErrors<RegisterFormValues>;
	watch: UseFormWatch<RegisterFormValues>;
}

export function RegisterForm({ onSubmit, isLoading, register, errors, watch }: RegisterFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const password = watch("password") || "";

	// 🔴 Dynamic client-side warnings (while typing)
	const warnings: string[] = [];

	if (password.length > 0 && password.length < 8) {
		warnings.push("Password must be at least 8 characters");
	}

	if (password && !/[A-Z]/.test(password)) {
		warnings.push("Add at least one uppercase letter");
	}

	if (password && !/[0-9]/.test(password)) {
		warnings.push("Add at least one number");
	}

	if (password && !/[@$!%*?&#]/.test(password)) {
		warnings.push("Add at least one special character");
	}

	return (
		<>
			<AuthHeader
				title="Create account"
				subtitle="Fill the details to get started"
				illustrationSrc="/assets/auth/register-illustration.jpg"
			/>

			<form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
				{/* First + Last name */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label>First Name</Label>
						<Input {...register("first_name")} />
					</div>

					<div className="space-y-1">
						<Label>Last Name</Label>
						<Input {...register("last_name")} />
					</div>
				</div>

				{/* College + Mobile */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label>College ID</Label>
						<Input {...register("college_id")} />
					</div>

					<div className="space-y-1">
						<Label>Mobile</Label>
						<Input {...register("mobile")} />
					</div>
				</div>

				{/* Department */}
				<div className="space-y-1">
					<Label>Department</Label>
					<Input {...register("department")} />
				</div>

				{/* Email */}
				<div className="space-y-1">
					<Label>Email</Label>
					<Input type="email" {...register("email")} />
				</div>

				{/* Password */}
				<div className="space-y-1">
					<Label>Password</Label>

					<div className="relative">
						<Input type={showPassword ? "text" : "password"} {...register("password")} />
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					{/* 🔴 Live warnings */}
					{warnings.length > 0 && (
						<ul className="mt-2 space-y-1 text-sm text-destructive">
							{warnings.map((msg) => (
								<li key={msg}>• {msg}</li>
							))}
						</ul>
					)}

					{/* Zod submit-time error (backup) */}
					{errors.password && (
						<p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
					)}
				</div>

				{/* Confirm Password */}
				<div className="space-y-1">
					<Label>Confirm Password</Label>

					<div className="relative">
						<Input type={showConfirm ? "text" : "password"} {...register("confirm_password")} />
						<button
							type="button"
							onClick={() => setShowConfirm((v) => !v)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						>
							{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					{errors.confirm_password && (
						<p className="mt-1 text-sm text-destructive">{errors.confirm_password.message}</p>
					)}
				</div>

				{/* 🔘 BUTTON — UNCHANGED */}
				<Button
					type="submit"
					variant="default"
					className="
            w-full 
            h-11 sm:h-12 
            text-base 
            bg-primary 
            text-primary-foreground
            hover:bg-primary/90
            transition
          "
					disabled={isLoading}
				>
					{isLoading ? "Creating account..." : "Register"}
				</Button>
			</form>

			<p className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
				Already have an account?{" "}
				<Link href="/login" className="text-primary font-medium">
					Login
				</Link>
			</p>
		</>
	);
}
