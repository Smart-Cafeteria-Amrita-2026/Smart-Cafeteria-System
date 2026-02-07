import type { PaymentMethod } from "@/types/payment/payment.types";

interface PaymentMethodSelectorProps {
	selectedMethod: PaymentMethod | null;
	onSelect: (method: PaymentMethod) => void;
	disabled?: boolean;
}

const METHODS: {
	label: string;
	value: PaymentMethod;
}[] = [
	{ label: "Card", value: "CARD" },
	{ label: "UPI", value: "UPI" },
	{ label: "Net Banking", value: "NET_BANKING" },
	{ label: "Cash", value: "CASH" },
];

export function PaymentMethodSelector({
	selectedMethod,
	onSelect,
	disabled = false,
}: PaymentMethodSelectorProps) {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-lg font-semibold">Select Payment Method</h3>

			<div className="grid grid-cols-2 gap-3">
				{METHODS.map((method) => {
					const isSelected = selectedMethod === method.value;

					return (
						<button
							key={method.value}
							type="button"
							disabled={disabled}
							onClick={() => onSelect(method.value)}
							className={`rounded-lg border px-4 py-3 text-sm font-medium transition
                ${
									isSelected
										? "border-blue-600 bg-blue-50 text-blue-700"
										: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
								}
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
						>
							{method.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
