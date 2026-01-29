import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const PDF_TYPE = "application/pdf";

export const bankDetailsSchema = z
  .object({
    accountHolderName: z
      .string()
      .min(1, "Account holder name is required"),

    bankName: z
      .string()
      .min(1, "Bank name is required"),

    accountNumber: z
      .string()
      .min(6, "Account number is too short"),

    confirmAccountNumber: z
      .string()
      .min(6, "Confirm account number is required"),

    ifscCode: z
      .string()
      .regex(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Invalid IFSC code format"
      ),

    cancelledCheque: z
      .custom<FileList>()
      .refine((files) => files?.length === 1, "Cancelled cheque is required")
      .refine(
        (files) => files?.[0]?.type === PDF_TYPE,
        "Only PDF files are allowed"
      )
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        "File size must be less than 2MB"
      ),
  })
  .refine(
    (data) => data.accountNumber === data.confirmAccountNumber,
    {
      path: ["confirmAccountNumber"],
      message: "Account numbers do not match",
    }
  );

export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;
