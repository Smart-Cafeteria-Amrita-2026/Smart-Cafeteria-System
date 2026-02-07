import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function TransactionCardSkeleton() {
	return (
		<div className="flex items-center justify-between border-b p-4 last:border-0">
			<div className="space-y-2">
				<SkeletonBlock className="h-4 w-20" />
				<SkeletonBlock className="h-3 w-32" />
			</div>
			<SkeletonBlock className="h-6 w-16 rounded-md" />
		</div>
	);
}
