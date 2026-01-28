import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const ownerDetailsSchema = z.object({
    name: z.string().min(2, "Owner name is required"),

    mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

    email: z.string().email("Enter a valid email address"),

    idProofType: z.string().min(2, "ID proof type is required"),

    idProofFile: z
        .any()
        .refine((files) => files?.length === 1, "ID proof file is required")
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only JPG, JPEG or PNG allowed"
        )
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            "File size must be less than 2MB"
        ),
});

export type OwnerDetailsFormValues = z.infer<
    typeof ownerDetailsSchema
>;
