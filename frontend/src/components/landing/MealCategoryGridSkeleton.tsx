import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

interface MealCategoryGridSkeletonProps {
	count?: number;
}

export function MealCategoryGridSkeleton({ count = 4 }: MealCategoryGridSkeletonProps) {
	return (
		<section className="bg-blue-600 py-24">
			<div className="container mx-auto px-4">
				<SkeletonBlock className="h-8 w-48 mx-auto mb-14 bg-blue-400" />

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
					{Array.from({ length: count }).map((_, index) => (
						<div key={index} className="bg-white rounded-2xl p-6 text-center">
							<SkeletonBlock className="h-32 w-full mb-4" />
							<SkeletonBlock className="h-5 w-24 mx-auto mb-2" />
							<SkeletonBlock className="h-4 w-36 mx-auto" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
