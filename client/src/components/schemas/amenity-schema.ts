import { z } from "zod";

export const amenitySchema = z.object({
  amenities: z
    .array(z.number())
    .min(1, "Select at least one amenity"),
});

export type AmenityFormValues = z.infer<typeof amenitySchema>;
