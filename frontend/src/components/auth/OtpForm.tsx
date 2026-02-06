import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "./AuthHeader";

interface OtpFormProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
}

export function OtpForm({ onSubmit, isLoading }: OtpFormProps) {
	return (
		<>
			{/* Centered Header */}
			<AuthHeader
				title="Almost there!"
				subtitle="Enter the 6-digit code sent to your email"
				illustrationSrc="/assets/auth/otp-illustration.jpg"
			/>

			{/* OTP Form */}
			<form onSubmit={onSubmit} className="space-y-6">
				{/* OTP Boxes */}
				<div className="mx-auto w-full max-w-xs">
					<div className="grid grid-cols-6 gap-2 sm:gap-3">
						{Array.from({ length: 6 }).map((_, index) => (
							<Input
								key={index}
								type="text"
								inputMode="numeric"
								maxLength={1}
								className="
                  h-11 sm:h-14
                  text-center
                  text-base sm:text-lg
                  font-semibold
                "
							/>
						))}
					</div>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
					disabled={isLoading}
				>
					{isLoading ? "Verifying..." : "Verify OTP"}
				</Button>
			</form>

			{/* Resend */}
			<p className="mt-4 text-center text-sm text-muted-foreground">
				Didn’t receive the code?{" "}
				<button type="button" className="text-primary font-medium hover:underline">
					Resend OTP
				</button>
			</p>
		</>
	);
}
