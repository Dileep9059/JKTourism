import { z } from "zod";

export const managerDetailsSchema = z.object({
    managerName: z.string().min(2, "Manager name is required"),
    mobileNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    alternateContactNumber: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit number")
        .optional()
        .or(z.literal("")),
    emailAddress: z.string().email("Enter a valid email address"),
});

export type ManagerDetailsFormValues = z.infer<
    typeof managerDetailsSchema
>;
