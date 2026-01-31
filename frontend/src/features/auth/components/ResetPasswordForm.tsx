import { UseFormRegister } from "react-hook-form";
import { ResetPasswordFormValues } from "../schemas/auth.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";

interface ResetPasswordFormProps {
    register: UseFormRegister<ResetPasswordFormValues>;
    onSubmit: () => void;
    isLoading: boolean;
    errors: {
        new_password?: string;
        confirm_password?: string;
    };
}

export function ResetPasswordForm({
    register,
    onSubmit,
    isLoading,
    errors,
}: ResetPasswordFormProps) {
    return (
        <>
            <AuthHeader
                title="Set a new password"
                subtitle="Choose a strong password you haven’t used before"
                illustrationSrc="/assets/auth/reset-password-illustration.jpg"
            />

            <form onSubmit={onSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-1">
                    <Label htmlFor="new_password">New password</Label>
                    <Input
                        id="new_password"
                        type="password"
                        className="h-11 sm:h-12"
                        {...register("new_password")}
                    />
                    {errors.new_password && (
                        <p className="text-sm text-destructive">
                            {errors.new_password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <Label htmlFor="confirm_password">Confirm password</Label>
                    <Input
                        id="confirm_password"
                        type="password"
                        className="h-11 sm:h-12"
                        {...register("confirm_password")}
                    />
                    {errors.confirm_password && (
                        <p className="text-sm text-destructive">
                            {errors.confirm_password}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update password"}
                </Button>
            </form>
        </>
    );
}
