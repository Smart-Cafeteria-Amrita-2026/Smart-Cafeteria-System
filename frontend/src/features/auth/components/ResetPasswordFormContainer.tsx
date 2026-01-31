"use client";

import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "../schemas/auth.schemas";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { useResetPassword } from "../hooks/useResetPassword";

export function ResetPasswordFormContainer() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

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
            token,
            new_password: data.new_password,
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
