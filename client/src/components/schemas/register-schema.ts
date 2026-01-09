import { z } from "zod";

const nameRegex = /^[A-Za-z\s]+$/;

export const registerSchema = z
    .object({
        firstname: z.string().min(2, "First name must be at least 2 characters").regex(nameRegex, "First name must contain only alphabets"),
        middlename: z.string().optional().refine(
            (val) => !val || nameRegex.test(val),
            "Middle name must contain only alphabets"
        ),
        lastname: z.string().min(2, "Last name must be at least 2 characters").regex(nameRegex, "Last name must contain only alphabets"),

        email: z.string().email("Invalid email address"),

        mobile: z
            .string()
            .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

        gender: z.enum(["MALE", "FEMALE", "OTHER"], {
            message: "Please select gender",
        }),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain one uppercase letter")
            .regex(/[a-z]/, "Must contain one lowercase letter")
            .regex(/[0-9]/, "Must contain one number")
            .regex(/[@$!%*?&#]/, "Must contain one special character"),

        confirmpassword: z.string(),
    })
    .refine((data) => data.password === data.confirmpassword, {
        message: "Passwords do not match",
        path: ["confirmpassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
