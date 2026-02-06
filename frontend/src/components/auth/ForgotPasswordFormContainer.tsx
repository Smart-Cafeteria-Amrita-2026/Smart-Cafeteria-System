"use client";

import { useForm } from "react-hook-form";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { ForgotPasswordFormSkeleton } from "./ForgotPasswordFormSkeleton";

interface ForgotPasswordFormValues {
	email: string;
}

export function ForgotPasswordFormContainer() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<ForgotPasswordFormValues>();

	const { mutate, isPending } = useForgotPassword();

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		console.log("Forgot password email:", data.email);
		mutate(data);
	};

	if (isPending) {
		return <ForgotPasswordFormSkeleton />;
	}

	return (
		<ForgotPasswordForm
			register={register}
			onSubmit={handleSubmit(onSubmit)}
			isLoading={isSubmitting}
		/>
	);
}
