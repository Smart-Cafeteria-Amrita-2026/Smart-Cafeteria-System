"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Star } from "lucide-react";
import { feedbackSchema, type FeedbackFormValues } from "@/src/validations/feedback.schema";
import { useSubmitFeedback } from "@/src/hooks/useFeedback";
import { useState } from "react";

interface Props {
	bookingId: number;
	tokenId: number;
	onClose: () => void;
}

export function FeedbackModal({ bookingId, tokenId, onClose }: Props) {
	const { mutateAsync: submitFeedback, isPending } = useSubmitFeedback();
	const [hoveredRating, setHoveredRating] = useState(0);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FeedbackFormValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			rating: 0,
			comment: "",
		},
	});

	const rating = watch("rating");

	const onSubmit = async (values: FeedbackFormValues) => {
		try {
			await submitFeedback({
				booking_id: bookingId,
				token_id: tokenId,
				...values,
			});
			onClose();
		} catch (error) {
			// Toast handled in hook
		}
	};

	return (
		<div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
			<div className="w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-3xl bg-white p-6 shadow-2xl">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-black text-gray-900">Meal Feedback</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Rating Stars */}
					<div className="flex flex-col items-center gap-3">
						<p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
							How was your meal?
						</p>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setValue("rating", star, { shouldValidate: true })}
									onMouseEnter={() => setHoveredRating(star)}
									onMouseLeave={() => setHoveredRating(0)}
									className="transition-transform active:scale-90"
									aria-label={`${star} stars`}
								>
									<Star
										size={40}
										className={
											star <= (hoveredRating || rating)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-200"
										}
									/>
								</button>
							))}
						</div>
						{errors.rating && (
							<p className="text-xs text-red-500 font-medium">{errors.rating.message}</p>
						)}
					</div>

					{/* Comment Area */}
					<div className="space-y-2">
						<label htmlFor="comment" className="text-sm font-bold text-gray-700">
							Comments <span className="text-gray-400 font-normal">(Optional)</span>
						</label>
						<textarea
							{...register("comment")}
							id="comment"
							placeholder="Tell us what you liked or how we can improve..."
							className="w-full h-32 rounded-2xl border border-gray-200 p-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
						/>
						{errors.comment && (
							<p className="text-xs text-red-500 font-medium">{errors.comment.message}</p>
						)}
					</div>

					{/* Buttons */}
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-600 hover:bg-gray-200 transition-all"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex-[2] rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
						>
							{isPending ? "Submitting..." : "Submit Feedback"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
