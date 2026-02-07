import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* ===============================
   Schema
================================ */

const upiFormSchema = z.object({
	upiId: z
		.string()
		.min(3, "UPI ID is required")
		.regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format"),
});

export type UpiFormValues = z.infer<typeof upiFormSchema>;

/* ===============================
   Props
================================ */

interface UpiFormProps {
	disabled?: boolean;
	onSubmit: (values: UpiFormValues) => void;
}

/* ===============================
   Component
================================ */

export function UpiForm({ disabled = false, onSubmit }: UpiFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpiFormValues>({
		resolver: zodResolver(upiFormSchema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
			{/* UPI ID */}
			<div>
				<input
					type="text"
					placeholder="UPI ID (e.g., name@upi)"
					disabled={disabled}
					{...register("upiId")}
					className="w-full rounded-lg border px-3 py-2 text-sm"
				/>
				{errors.upiId && <p className="mt-1 text-xs text-red-600">{errors.upiId.message}</p>}
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={disabled}
				className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				Pay via UPI
			</button>
		</form>
	);
}
