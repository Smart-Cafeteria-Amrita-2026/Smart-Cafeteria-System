import type { ExampleItem } from "../types/exampleFeatureTypes";

/**
 * Example dumb component
 * - Pure UI
 * - Takes typed props
 * - No API call inside
 */

type ExampleComponentProps = {
	item: ExampleItem;
	onClick?: () => void;
};

export function ExampleComponent({ item, onClick }: ExampleComponentProps) {
	return (
		<button
			type="button"
			className="rounded-lg border p-4 shadow hover:bg-gray-50 cursor-pointer text-left w-full"
			onClick={onClick}
		>
			<h3 className="text-lg font-semibold mb-1">{item.title}</h3>
			<p className="text-gray-700 mb-2">{item.description}</p>
			{item.date && <p className="text-sm text-gray-500">{item.date}</p>}
		</button>
	);
}
