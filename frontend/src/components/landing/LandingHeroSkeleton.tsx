import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function LandingHeroSkeleton() {
	return (
		<section className="py-20 text-center">
			<SkeletonBlock className="h-12 w-3/4 mx-auto mb-4" />
			<SkeletonBlock className="h-5 w-1/2 mx-auto" />
		</section>
	);
}
