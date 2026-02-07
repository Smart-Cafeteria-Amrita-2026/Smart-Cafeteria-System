import { UserPlus, UserMinus } from "lucide-react";

interface Props {
	count: number;
	onChange: (count: number) => void;
}

export function MemberCounter({ count, onChange }: Props) {
	return (
		<div className="flex items-center justify-between rounded-2xl bg-white p-4 border shadow-sm">
			<div className="space-y-1">
				<h3 className="font-bold text-gray-900">How many members?</h3>
				<p className="text-sm text-gray-500">Add people joining your meal</p>
			</div>

			<div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border">
				<button
					onClick={() => count > 1 && onChange(count - 1)}
					className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600 transition-colors"
				>
					<UserMinus size={20} />
				</button>

				<span className="w-8 text-center text-xl font-bold text-gray-900">{count}</span>

				<button
					onClick={() => count < 10 && onChange(count + 1)}
					className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600 transition-colors"
				>
					<UserPlus size={20} />
				</button>
			</div>
		</div>
	);
}
