"use client";

import { OtpForm } from "./OtpForm";

export default function OtpFormContainer() {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// OTP submit logic (later)
	};

	return <OtpForm onSubmit={handleSubmit} isLoading={false} />;
}
