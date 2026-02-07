import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function BillSummarySkeleton() {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-4">
			{/* Title */}
			<SkeletonBlock className="mb-4 h-5 w-32" />

			{/* Items */}
			<div className="space-y-2">
				<SkeletonBlock className="h-4 w-full" />
				<SkeletonBlock className="h-4 w-full" />
				<SkeletonBlock className="h-4 w-3/4" />
			</div>

			<div className="my-4 h-px bg-gray-200" />

			{/* Total */}
			<div className="flex justify-between">
				<SkeletonBlock className="h-5 w-16" />
				<SkeletonBlock className="h-5 w-20" />
			</div>
		</div>
	);
}
