import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function TokenDetailCardSkeleton() {
	return (
		<div className="rounded-2xl border bg-white shadow-sm overflow-hidden animate-pulse">
			{/* Top bar */}
			<div className="h-1.5 bg-gray-200" />
			<div className="p-4 sm:p-5 space-y-4">
				{/* Header */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<SkeletonBlock className="h-8 w-8 rounded-lg" />
						<SkeletonBlock className="h-6 w-40" />
					</div>
					<SkeletonBlock className="h-6 w-20 rounded-full" />
				</div>
				{/* Details grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<SkeletonBlock className="h-4 w-36" />
					<SkeletonBlock className="h-4 w-40" />
					<SkeletonBlock className="h-4 w-32" />
					<SkeletonBlock className="h-4 w-44" />
				</div>
			</div>
		</div>
	);
}
