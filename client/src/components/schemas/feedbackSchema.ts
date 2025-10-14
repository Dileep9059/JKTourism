// lib/feedbackSchema.ts
import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  rating: z.number().min(1, "Please select a rating"),
  comments: z.string().min(5, "Comment must be at least 5 characters"),
});

export type FeedbackSchema = z.infer<typeof feedbackSchema>;
