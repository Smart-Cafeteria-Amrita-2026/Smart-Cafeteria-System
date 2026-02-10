"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OtpForm } from "./OtpForm";
import { OtpFormSkeleton } from "./OtpFormSkeleton";
import { useGenerateOtp } from "@/hooks/auth/useGenerateOtp";
import { useVerifyOtp } from "@/hooks/auth/useVerifyOtp";
import { useResendOtp } from "@/hooks/auth/useResendOtp";
import { useAuthStore } from "@/stores/auth.store";

export default function OtpFormContainer() {
	const router = useRouter();
	const email = useAuthStore((s) => s.email);
	const isHydrated = useAuthStore((s) => s.isHydrated);

	const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [canResend, setCanResend] = useState<boolean>(false);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);

	const { mutate: generateOtp, isPending: isGenerating } = useGenerateOtp();
	const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
	const { mutate: resendOtp, isPending: isResending } = useResendOtp();

	// Start the countdown timer
	const startTimer = useCallback((seconds: number) => {
		setTimeLeft(seconds);
		setCanResend(false);
	}, []);

	// Redirect if no email (user hasn't logged in)
	useEffect(() => {
		if (isHydrated && !email) {
			toast.error("Please login first.");
			router.push("/login");
		}
	}, [isHydrated, email, router]);

	// Generate OTP on mount
	useEffect(() => {
		if (isHydrated && email && !isInitialized) {
			generateOtp(
				{ email },
				{
					onSuccess: (data) => {
						if (data?.data?.expiresInSeconds) {
							startTimer(data.data.expiresInSeconds);
						}
						setIsInitialized(true);
					},
					onError: () => {
						setIsInitialized(true);
					},
				}
			);
		}
	}, [isHydrated, email, isInitialized, generateOtp, startTimer]);

	// Countdown effect
	useEffect(() => {
		if (timeLeft <= 0) {
			setCanResend(true);
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [timeLeft]);

	const handleOtpChange = (index: number, value: string) => {
		// Only allow single numeric digit
		if (value && !/^\d$/.test(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		// Allow tab, backspace etc. — handled in OtpForm for focus management
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			const newOtp = [...otp];
			newOtp[index - 1] = "";
			setOtp(newOtp);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").trim();
		if (/^\d{6}$/.test(pasted)) {
			setOtp(pasted.split(""));
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email) return;

		const otpString = otp.join("");
		if (otpString.length !== 6) {
			toast.error("Please enter the complete 6-digit OTP.");
			return;
		}

		verifyOtp({ email, otp: otpString });
	};

	const handleResend = () => {
		if (!email) return;

		setOtp(Array(6).fill(""));
		resendOtp(
			{ email },
			{
				onSuccess: (data) => {
					if (data?.data?.expiresInSeconds) {
						startTimer(data.data.expiresInSeconds);
					}
				},
			}
		);
	};

	// Show skeleton while hydrating or generating initial OTP
	if (!isHydrated || (!isInitialized && isGenerating)) {
		return <OtpFormSkeleton />;
	}

	if (!email) {
		return null; // Will redirect via useEffect
	}

	return (
		<OtpForm
			otp={otp}
			onOtpChange={handleOtpChange}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
			onSubmit={handleSubmit}
			onResend={handleResend}
			isLoading={isVerifying}
			isResending={isResending}
			timeLeft={timeLeft}
			canResend={canResend}
		/>
	);
}
