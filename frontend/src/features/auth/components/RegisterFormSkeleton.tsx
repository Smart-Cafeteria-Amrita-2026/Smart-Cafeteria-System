import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function RegisterFormSkeleton() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 7 }).map((_, i) => (
				<SkeletonBlock key={i} className="h-10 w-full" />
			))}
		</div>
	);
}
