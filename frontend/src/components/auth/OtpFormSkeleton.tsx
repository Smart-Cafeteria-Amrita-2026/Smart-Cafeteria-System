import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function OtpFormSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<div className="text-center space-y-3">
				<SkeletonBlock className="mx-auto h-40 w-full max-w-xs rounded-2xl" />
				<SkeletonBlock className="mx-auto h-8 w-48" />
				<SkeletonBlock className="mx-auto h-5 w-64" />
			</div>

			{/* Timer skeleton */}
			<SkeletonBlock className="mx-auto h-5 w-40" />

			{/* OTP boxes skeleton */}
			<div className="mx-auto w-full max-w-xs">
				<div className="grid grid-cols-6 gap-2 sm:gap-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<SkeletonBlock key={i} className="h-11 sm:h-14 rounded-md" />
					))}
				</div>
			</div>

			{/* Button skeleton */}
			<SkeletonBlock className="h-11 sm:h-12 w-full rounded-md" />

			{/* Resend skeleton */}
			<SkeletonBlock className="mx-auto h-4 w-48" />
		</div>
	);
}
