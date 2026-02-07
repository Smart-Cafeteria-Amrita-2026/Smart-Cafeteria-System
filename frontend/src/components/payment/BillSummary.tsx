import type { BillSummary as BillSummaryType } from "@/types/payment/payment.types";

interface BillSummaryProps {
	bill: BillSummaryType;
}

export function BillSummary({ bill }: BillSummaryProps) {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4">
			<h3 className="mb-3 text-lg font-semibold">Bill Summary</h3>

			<div className="space-y-2">
				{bill.items.map((item) => (
					<div key={item.itemId} className="flex justify-between text-sm">
						<span>
							{item.name} × {item.quantity}
						</span>
						<span className="font-medium">₹{item.totalPrice}</span>
					</div>
				))}
			</div>

			<div className="my-3 h-px bg-gray-200" />

			<div className="flex justify-between text-base font-semibold">
				<span>Total</span>
				<span>₹{bill.totalAmount}</span>
			</div>
		</div>
	);
}
