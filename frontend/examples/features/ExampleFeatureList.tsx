import { ExampleComponent } from "../components/ExampleComponent";
import { ExampleSkeleton } from "../components/ExampleSkeleton";
import { useExampleData } from "../hooks/useExampleFeature";

/**
 * Example smart component
 * - Uses hook to get data
 * - Maps data to dumb components
 * - Handles loading, error, empty state
 */

export function ExampleFeatureList() {
	const { data, isLoading, error } = useExampleData();

	if (isLoading)
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<ExampleSkeleton key={i} />
				))}
			</div>
		);
	if (error) return <p className="text-red-500">Failed to load data.</p>;
	if (!data || data.length === 0) return <p className="text-gray-500">No data found.</p>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((item) => (
				<ExampleComponent key={item.id} item={item} />
			))}
		</div>
	);
}
