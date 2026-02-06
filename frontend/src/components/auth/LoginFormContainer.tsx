"use client";

import { LoginForm } from "./LoginForm";
import { useLogin } from "@/hooks/auth/useLogin";

export function LoginFormContainer() {
	const { mutate: login, isPending } = useLogin();

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		login({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});
	}

	return <LoginForm onSubmit={handleSubmit} isLoading={isPending} />;
}
