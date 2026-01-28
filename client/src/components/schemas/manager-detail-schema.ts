import { z } from "zod";

export const managerDetailsSchema = z.object({
    name: z.string().min(2, "Manager name is required"),
    mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    alternateContact: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit number")
        .optional()
        .or(z.literal("")),
    email: z.string().email("Enter a valid email address"),
});

export type ManagerDetailsFormValues = z.infer<
    typeof managerDetailsSchema
>;
