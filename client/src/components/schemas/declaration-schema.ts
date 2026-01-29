import { z } from "zod";

export const declarationSchema = z.object({
  consent: z.boolean().refine((value) => value === true, {
    message: "You must agree to the declaration to continue",
  }),

  ownerName: z
    .string()
    .min(1, "Name is required"),

  declarationDate: z
    .string()
    .refine(
      (date) => new Date(date) <= new Date(),
      "Date cannot be in the future"
    ),

});

export type DeclarationFormValues = z.infer<typeof declarationSchema>;
