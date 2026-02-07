import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function MenuItemSkeleton() {
	return (
		<div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 animate-pulse">
			<SkeletonBlock className="h-24 w-24 rounded-xl flex-shrink-0" />

			<div className="flex-1 space-y-2">
				<SkeletonBlock className="h-5 w-32" />
				<SkeletonBlock className="h-3 w-full" />
				<SkeletonBlock className="h-3 w-2/3" />

				<div className="pt-2 flex items-center justify-between">
					<SkeletonBlock className="h-6 w-16" />
					<SkeletonBlock className="h-8 w-16 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
