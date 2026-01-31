"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    resetPasswordSchema,
    type ResetPasswordFormValues,
} from "../schemas/auth.schemas";
import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordFormContainer() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    // ✅ SUBMIT HANDLER
    const onSubmit = async (data: ResetPasswordFormValues) => {
        console.log("New password:", data.new_password);
        // API call later
    };

    return (
        <ResetPasswordForm
            register={register}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            errors={{
                new_password: errors.new_password?.message,
                confirm_password: errors.confirm_password?.message,
            }}
        />
    );
}
