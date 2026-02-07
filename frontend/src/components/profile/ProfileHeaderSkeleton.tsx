import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function ProfileHeaderSkeleton() {
	return (
		<div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border animate-pulse">
			<div className="relative flex items-center gap-4">
				<SkeletonBlock className="h-16 w-16 rounded-2xl" />
				<div className="space-y-2">
					<SkeletonBlock className="h-6 w-32" />
					<SkeletonBlock className="h-4 w-48" />
				</div>
			</div>
		</div>
	);
}
