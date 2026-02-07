import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* ===============================
   Schema
================================ */

const cardFormSchema = z.object({
	cardNumber: z
		.string()
		.min(16, "Card number must be 16 digits")
		.max(16, "Card number must be 16 digits"),
	cardHolderName: z.string().min(1, "Card holder name is required"),
	expiry: z.string().min(5, "Expiry must be MM/YY"),
	cvv: z.string().min(3, "CVV must be 3 digits").max(3),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;

/* ===============================
   Props
================================ */

interface CardFormProps {
	disabled?: boolean;
	onSubmit: (values: CardFormValues) => void;
}

/* ===============================
   Component
================================ */

export function CardForm({ disabled = false, onSubmit }: CardFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CardFormValues>({
		resolver: zodResolver(cardFormSchema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
			{/* Card Number */}
			<div>
				<input
					type="text"
					placeholder="Card Number"
					disabled={disabled}
					{...register("cardNumber")}
					className="w-full rounded-lg border px-3 py-2 text-sm"
				/>
				{errors.cardNumber && (
					<p className="mt-1 text-xs text-red-600">{errors.cardNumber.message}</p>
				)}
			</div>

			{/* Card Holder */}
			<div>
				<input
					type="text"
					placeholder="Card Holder Name"
					disabled={disabled}
					{...register("cardHolderName")}
					className="w-full rounded-lg border px-3 py-2 text-sm"
				/>
				{errors.cardHolderName && (
					<p className="mt-1 text-xs text-red-600">{errors.cardHolderName.message}</p>
				)}
			</div>

			{/* Expiry + CVV */}
			<div className="flex gap-3">
				<div className="flex-1">
					<input
						type="text"
						placeholder="MM/YY"
						disabled={disabled}
						{...register("expiry")}
						className="w-full rounded-lg border px-3 py-2 text-sm"
					/>
					{errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry.message}</p>}
				</div>

				<div className="flex-1">
					<input
						type="password"
						placeholder="CVV"
						disabled={disabled}
						{...register("cvv")}
						className="w-full rounded-lg border px-3 py-2 text-sm"
					/>
					{errors.cvv && <p className="mt-1 text-xs text-red-600">{errors.cvv.message}</p>}
				</div>
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={disabled}
				className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				Use Card
			</button>
		</form>
	);
}
