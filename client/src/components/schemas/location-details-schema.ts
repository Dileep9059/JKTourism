import { z } from "zod";

export const locationDetailsSchema = z.object({
  addressLine1: z.string().min(5, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  latitude: z
    .string()
    .regex(
      /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
      "Enter a valid latitude"
    ),
  longitude: z
    .string()
    .regex(
      /^-?((1[0-7]\d)|([1-9]?\d))(\.\d+)?|180(\.0+)?$/,
      "Enter a valid longitude"
    ),
  googleMapsLink: z
    .string()
    .url("Enter a valid Google Maps URL"),
  nearestLandmark: z.string().min(2, "Nearest landmark is required"),
});

export type LocationDetailsFormValues = z.infer<
  typeof locationDetailsSchema
>;
