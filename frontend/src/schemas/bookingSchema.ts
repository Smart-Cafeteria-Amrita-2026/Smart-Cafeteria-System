import { z } from "zod";

export const bookingSchema = z.object({
  mealType: z.string().refine(
    (val) => ["Breakfast", "Lunch", "Dinner"].includes(val),
    { message: "Please select Breakfast, Lunch, or Dinner" }
  ),
  slotTime: z.string().min(1, "Please select a time slot"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;