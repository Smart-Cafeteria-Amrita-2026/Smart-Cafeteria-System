"use client";

import { useForm } from "react-hook-form";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

interface ForgotPasswordFormValues {
	email: string;
}

export function ForgotPasswordFormContainer() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<ForgotPasswordFormValues>();

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		console.log("Forgot password email:", data.email);
		// API call later
	};

	return (
		<ForgotPasswordForm
			register={register}
			onSubmit={handleSubmit(onSubmit)}
			isLoading={isSubmitting}
		/>
	);
}
