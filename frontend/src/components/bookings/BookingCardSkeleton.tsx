import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function BookingCardSkeleton() {
	return (
		<div className="flex flex-col gap-3 border-b p-4 last:border-0">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<SkeletonBlock className="h-4 w-32" />
					<SkeletonBlock className="h-3 w-24" />
				</div>
				<SkeletonBlock className="h-6 w-16 rounded-md" />
			</div>
			<div className="flex gap-2">
				<SkeletonBlock className="h-4 w-12 rounded" />
				<SkeletonBlock className="h-4 w-12 rounded" />
				<SkeletonBlock className="h-4 w-12 rounded" />
			</div>
		</div>
	);
}
