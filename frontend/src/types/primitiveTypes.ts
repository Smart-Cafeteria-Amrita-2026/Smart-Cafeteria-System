export type ApiResponse<T> = T & { message?: string };

export interface ErrorBoundaryProps {
	children: React.ReactNode;
}

export interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}
