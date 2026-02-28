import { z } from "zod";

export const feedbackSchema = z.object({
	rating: z.number().min(1, "Please select a rating").max(5),
	comment: z.string().max(500, "Comment must be under 500 characters").optional(),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
