import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function ResetPasswordFormSkeleton() {
	return (
		<div className="space-y-4">
			<SkeletonBlock className="h-10 w-full" />
			<SkeletonBlock className="h-10 w-full" />
		</div>
	);
}
