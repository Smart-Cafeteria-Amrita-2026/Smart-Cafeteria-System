import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* ===============================
   Schema
================================ */

const netBankingSchema = z.object({
	bankName: z.string().min(1, "Please select a bank"),
});

export type NetBankingFormValues = z.infer<typeof netBankingSchema>;

/* ===============================
   Props
================================ */

interface NetBankingFormProps {
	disabled?: boolean;
	onSubmit: (values: NetBankingFormValues) => void;
}

/* ===============================
   Banks (UI-level constant)
================================ */

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Canara Bank"];

/* ===============================
   Component
================================ */

export function NetBankingForm({ disabled = false, onSubmit }: NetBankingFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<NetBankingFormValues>({
		resolver: zodResolver(netBankingSchema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
			{/* Bank Selector */}
			<div>
				<select
					disabled={disabled}
					{...register("bankName")}
					className="w-full rounded-lg border px-3 py-2 text-sm"
					defaultValue=""
				>
					<option value="" disabled>
						Select Bank
					</option>
					{BANKS.map((bank) => (
						<option key={bank} value={bank}>
							{bank}
						</option>
					))}
				</select>

				{errors.bankName && <p className="mt-1 text-xs text-red-600">{errors.bankName.message}</p>}
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={disabled}
				className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				Pay via Net Banking
			</button>
		</form>
	);
}
