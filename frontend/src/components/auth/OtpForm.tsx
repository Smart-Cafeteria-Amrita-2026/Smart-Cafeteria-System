import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthHeader } from "./AuthHeader";
import { useRef, useEffect } from "react";

interface OtpFormProps {
	otp: string[];
	onOtpChange: (index: number, value: string) => void;
	onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
	onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	onResend: () => void;
	isLoading: boolean;
	isResending: boolean;
	timeLeft: number;
	canResend: boolean;
}

export function OtpForm({
	otp,
	onOtpChange,
	onKeyDown,
	onPaste,
	onSubmit,
	onResend,
	isLoading,
	isResending,
	timeLeft,
	canResend,
}: OtpFormProps) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		inputRefs.current[0]?.focus();
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<>
			{/* Centered Header */}
			<AuthHeader
				title="Almost there!"
				subtitle="Enter the 6-digit code sent to your email"
				illustrationSrc="/assets/auth/otp-illustration.jpg"
			/>

			{/* Timer */}
			<div className="mb-4 text-center">
				{timeLeft > 0 ? (
					<p className="text-sm font-medium text-muted-foreground">
						OTP expires in{" "}
						<span className="text-primary font-semibold">{formatTime(timeLeft)}</span>
					</p>
				) : (
					<p className="text-sm font-medium text-destructive">OTP has expired. Please resend.</p>
				)}
			</div>

			{/* OTP Form */}
			<form onSubmit={onSubmit} className="space-y-6">
				{/* OTP Boxes */}
				<div className="mx-auto w-full max-w-xs">
					<div className="grid grid-cols-6 gap-2 sm:gap-3">
						{otp.map((digit, index) => (
							<Input
								key={index}
								ref={(el) => {
									inputRefs.current[index] = el;
								}}
								type="text"
								inputMode="numeric"
								maxLength={1}
								value={digit}
								onChange={(e) => {
									onOtpChange(index, e.target.value);
									if (e.target.value && index < 5) {
										inputRefs.current[index + 1]?.focus();
									}
								}}
								onKeyDown={(e) => {
									onKeyDown(index, e);
									if (e.key === "Backspace" && !digit && index > 0) {
										inputRefs.current[index - 1]?.focus();
									}
								}}
								onPaste={index === 0 ? onPaste : undefined}
								className="h-11 sm:h-14 text-center text-base sm:text-lg font-semibold"
							/>
						))}
					</div>
				</div>

				{/* Submit Button */}
				<Button
					type="submit"
					className="w-full h-11 sm:h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition"
					disabled={isLoading || otp.some((d) => !d) || timeLeft <= 0}
				>
					{isLoading ? "Verifying..." : "Verify OTP"}
				</Button>
			</form>

			{/* Resend */}
			<p className="mt-4 text-center text-sm text-muted-foreground">
				{"Didn't receive the code? "}
				<button
					type="button"
					className="text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={!canResend || isResending}
					onClick={onResend}
				>
					{isResending ? "Resending..." : "Resend OTP"}
				</button>
			</p>
		</>
	);
}
