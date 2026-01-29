import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const PDF_MIME_TYPE = "application/pdf";

export const registrationSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required"),

  registrationCertificate: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "PDF file is required")
    .refine(
      (files) => files?.[0]?.type === PDF_MIME_TYPE,
      "Only PDF files are allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size must be less than 2MB"
    ),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
