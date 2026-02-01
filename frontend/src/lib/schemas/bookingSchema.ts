import { z } from "zod";

export const bookingSchema = z.object({
  mealType: z.enum(["Breakfast", "Lunch", "Dinner"]),
  slotTime: z.string(),
}).refine(
  (data) => data.mealType && data.slotTime, 
  {
    message: "Please select both meal type and time slot",
    path: ["mealType"]
  }
);