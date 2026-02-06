import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function OtpFormSkeleton() {
	return (
		<div className="space-y-4">
			<SkeletonBlock className="h-10 w-full" />
			<SkeletonBlock className="h-10 w-full" />
		</div>
	);
}
