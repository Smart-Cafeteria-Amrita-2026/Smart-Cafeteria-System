import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeader } from "./AuthHeader";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

interface LoginFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
    return (
        <>
            {/* Header with illustration */}
            <AuthHeader
                title="Sign in"
                subtitle="Enter your credentials to continue"
                illustrationSrc="/assets/auth/login-illustration.jpg"
            />

            {/* Login form */}
            <form
                onSubmit={onSubmit}
                className="space-y-4 sm:space-y-5"
            >
                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 sm:h-12"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        className="h-11 sm:h-12"
                    />
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

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium hover:bg-muted transition"
                >
                    <FcGoogle size={18} />
                    Continue with Google
                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium hover:bg-muted transition"
                >
                    <FaFacebook size={18} className="text-blue-600" />
                    Continue with Facebook
                </button>
            </div>

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
