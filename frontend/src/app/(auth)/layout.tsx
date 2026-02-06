export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-muted px-4 sm:px-6">
			<div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-background p-6 sm:p-8 shadow-md">
				{children}
			</div>
		</div>
	);
}
