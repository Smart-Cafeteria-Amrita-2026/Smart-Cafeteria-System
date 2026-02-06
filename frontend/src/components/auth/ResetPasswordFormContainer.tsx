"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/validations/auth.schemas";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

export function ResetPasswordFormContainer() {
	const [token, setToken] = useState("");

	useEffect(() => {
		// Extract access_token from URL hash fragment
		const hash = window.location.hash;
		if (hash) {
			const params = new URLSearchParams(hash.substring(1)); // Remove the '#' and parse
			const accessToken = params.get("access_token");
			if (accessToken) {
				setToken(accessToken);
			}
		}
	}, []);

	const { mutateAsync, isPending } = useResetPassword();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const newPassword = watch("new_password");
	const confirmPassword = watch("confirm_password");

	const onSubmit = async (data: ResetPasswordFormValues) => {
		await mutateAsync({
			payload: {
				password: data.new_password,
			},
			token,
		});
	};

	return (
		<ResetPasswordForm
			register={register}
			errors={{
				new_password: errors.new_password?.message,
				confirm_password: errors.confirm_password?.message,
			}}
			onSubmit={handleSubmit(onSubmit)}
			isLoading={isPending}
			passwordValue={newPassword}
			confirmPasswordValue={confirmPassword}
		/>
	);
}
