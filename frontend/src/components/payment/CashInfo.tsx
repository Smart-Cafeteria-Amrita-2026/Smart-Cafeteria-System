interface CashInfoProps {
	disabled?: boolean;
}

export function CashInfo({ disabled = false }: CashInfoProps) {
	return (
		<div
			className={`mt-4 rounded-lg border p-4 text-sm ${
				disabled
					? "border-gray-200 bg-gray-100 text-gray-500"
					: "border-green-300 bg-green-50 text-green-800"
			}`}
		>
			<p className="font-medium">Cash Payment</p>

			<p className="mt-2">Pay directly at the cafeteria counter while collecting your food.</p>

			{disabled && (
				<p className="mt-2 text-xs italic">
					Cash payment will be available 30 minutes before your selected slot. You will be notified.
				</p>
			)}
		</div>
	);
}
