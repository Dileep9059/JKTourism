import { z } from "zod";

export const basicInfoSchema = z.object({
  legalName: z.string().min(2, "Legal name is required"),
  displayName: z.string().min(2, "Display name is required"),
  websiteUrl: z.string().url("Enter a valid website URL"),
  publicEmail: z.string().email("Enter a valid email"),
  publicPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  hotelType: z.enum(["hotel", "resort", "guest-house", "home-stay"], {
    required_error: "Hotel type is required",
  }),
  starRating: z
    .string()
    .optional(),
  yearOfEstablishment: z.string().min(4, "Select a year").optional(),
});

export type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
