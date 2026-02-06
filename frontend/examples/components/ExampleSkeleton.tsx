import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function ExampleSkeleton() {
	return (
		<div className="rounded-lg border p-4 shadow space-y-2">
			<SkeletonBlock className="h-6 w-1/2" />
			<SkeletonBlock className="h-4 w-3/4" />
			<SkeletonBlock className="h-4 w-full" />
		</div>
	);
}
