import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

/**
 * Example Feature Form
 *
 * - Uses React Hook Form (RHF)
 * - Uses Zod schema for validation
 * - Inferred types from Zod schema (type-safe form values)
 * - No manual validation logic
 */

// Step 1: Define Zod schema
// This schema defines both:
// - Validation rules
// - Type shape of form values
const exampleFormSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(5, "Description must be at least 5 characters"),
});

// Step 2: Infer form type from schema
// This makes form values type-safe
type ExampleFormValues = z.infer<typeof exampleFormSchema>;

export function ExampleFeatureForm() {
	// Step 3: Setup RHF with Zod resolver
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ExampleFormValues>({
		resolver: zodResolver(exampleFormSchema),
	});

	// Step 4: On form submit
	const onSubmit = (data: ExampleFormValues) => {
		alert(`Form submitted!\nTitle: ${data.title}\nDescription: ${data.description}`);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="title">Title</Label>
				<Input {...register("title")} id="title" type="text" placeholder="Title" />
				{errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
			</div>

			<div>
				<Label htmlFor="description">Description</Label>
				<Input {...register("description")} id="description" placeholder="Description" />
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
				)}
			</div>

			<Button type="submit">Submit</Button>
		</form>
	);
}
