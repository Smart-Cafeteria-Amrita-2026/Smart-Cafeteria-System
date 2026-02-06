import Image from "next/image";

interface AuthHeaderProps {
	title: string;
	subtitle?: string;
	illustrationSrc?: string;
}

export function AuthHeader({ title, subtitle, illustrationSrc }: AuthHeaderProps) {
	return (
		<div className="mb-6 text-center">
			{illustrationSrc && (
				<div className="mb-5 flex justify-center">
					{/* Colored Illustration Panel */}
					<div className="w-full max-w-xs rounded-2xl bg-primary/10 p-6 sm:p-8">
						<Image
							src={illustrationSrc}
							alt="Login illustration"
							width={160}
							height={160}
							className="mx-auto select-none"
							priority
						/>

						{/* Creative text */}
						<p className="mt-4 text-sm font-medium text-foreground">
							Secure access to your cafeteria
						</p>
						<p className="mt-1 text-xs text-muted-foreground">Fresh meals, faster checkouts 🍽️</p>
					</div>
				</div>
			)}

			<h1 className="mt-4 text-2xl sm:text-3xl font-semibold">{title}</h1>

			{subtitle && <p className="mt-1 text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
		</div>
	);
}
