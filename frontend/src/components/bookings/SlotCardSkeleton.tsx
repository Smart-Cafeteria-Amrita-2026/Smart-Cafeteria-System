import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function SlotCardSkeleton() {
	return (
		<div className="flex flex-col gap-2 rounded-2xl border-2 border-gray-100 p-4 animate-pulse">
			<div className="flex items-center justify-between">
				<SkeletonBlock className="h-6 w-24" />
				<SkeletonBlock className="h-5 w-5 rounded-full" />
			</div>
			<div className="flex items-center gap-2">
				<SkeletonBlock className="h-4 w-4 rounded" />
				<SkeletonBlock className="h-4 w-20" />
			</div>
		</div>
	);
}
