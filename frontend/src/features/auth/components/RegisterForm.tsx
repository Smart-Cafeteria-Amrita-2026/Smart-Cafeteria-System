import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { UseFormRegister } from "react-hook-form";
import { RegisterFormValues } from "../schemas/auth.schemas";

interface RegisterFormProps {
    register: UseFormRegister<RegisterFormValues>;
    errors: Partial<Record<keyof RegisterFormValues, string>>;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isLoading: boolean;
}

export function RegisterForm({ register, errors, onSubmit, isLoading }: RegisterFormProps) {
    return (
        <>
            {/* Centered Header */}
            <AuthHeader
                title="Register"
                subtitle="Create your account to get started"
                illustrationSrc="/assets/auth/register-illustration.jpg"
            />

            {/* Register Form */}
            <form
                onSubmit={onSubmit}
                className="space-y-4 sm:space-y-5"
            >
                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="first_name">First name</Label>
                        <Input
                            id="first_name"
                            placeholder="Test"
                            className="h-11 sm:h-12"
                            {...register("first_name")}
                        />
                        {errors.first_name && (
                            <p className="text-xs text-destructive">{errors.first_name}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input
                            id="last_name"
                            placeholder="User"
                            className="h-11 sm:h-12"
                            {...register("last_name")}
                        />
                        {errors.last_name && (
                            <p className="text-xs text-destructive">{errors.last_name}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="cb.students@amrita.edu"
                        className="h-11 sm:h-12"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                </div>

                {/* College ID */}
                <div className="space-y-1">
                    <Label htmlFor="college_id">College ID</Label>
                    <Input
                        id="college_id"
                        placeholder="CB.EN.U4CSE20001"
                        className="h-11 sm:h-12"
                        {...register("college_id")}
                    />
                    {errors.college_id && (
                        <p className="text-xs text-destructive">{errors.college_id}</p>
                    )}
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                    <Label htmlFor="mobile">Mobile number</Label>
                    <Input
                        id="mobile"
                        type="tel"
                        placeholder="9876543210"
                        className="h-11 sm:h-12"
                        {...register("mobile")}
                    />
                    {errors.mobile && (
                        <p className="text-xs text-destructive">{errors.mobile}</p>
                    )}
                </div>

                {/* Department */}
                <div className="space-y-1">
                    <Label htmlFor="department">Department</Label>
                    <Input
                        id="department"
                        placeholder="CSE"
                        className="h-11 sm:h-12"
                        {...register("department")}
                    />
                    {errors.department && (
                        <p className="text-xs text-destructive">{errors.department}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        className="h-11 sm:h-12"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                </div>

                {/* Role (handled by register default value in container) */}
                <input type="hidden" {...register("role")} />

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or sign up with
                    </span>
                </div>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium hover:bg-muted transition"
                >
                    <FcGoogle size={18} />
                    Google
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium hover:bg-muted transition"
                >
                    <FaFacebook size={18} className="text-blue-600" />
                    Facebook
                </button>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-sm sm:text-base text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium">
                    Sign in
                </Link>
            </p>
        </>
    );
}

