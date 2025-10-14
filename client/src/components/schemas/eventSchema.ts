import { z } from "zod";

const districtEnum = z.enum(["Jammu", "Kashmir"], {
    required_error: "District is required",
    invalid_type_error: "District must be either Jammu or Kashmir",
});

export const eventSchema = z
    .object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        image: z
            .custom<File>((file) => file instanceof File && file.size > 0, {
                message: "Image file is required",
            }),
        // locationUrl: z
        //     .string()
        //     .min(1, { message: "Location URL is required" })
        //     .url("Location URL must be valid"),

        district: districtEnum,

        ticketPrice: z.coerce
            .number({ invalid_type_error: "Ticket price must be a number" })
            .nonnegative({ message: "Ticket price must be non-negative" }),

        latitude: z.coerce
            .number({ invalid_type_error: "Latitude must be a number" })
            .refine((val) => val >= -90 && val <= 90, {
                message: "Latitude must be between -90 and 90",
            }),

        longitude: z.coerce
            .number({ invalid_type_error: "Longitude must be a number" })
            .refine((val) => val >= -180 && val <= 180, {
                message: "Longitude must be between -180 and 180",
            }),

        dateRange: z
            .object({
                from: z.date({ required_error: "Start date is required" }),
                to: z.date({ required_error: "End date is required" }),
            })
            .refine((range) => range.from <= range.to, {
                message: "End date must be after start date",
                path: ["to"],
            }),

        startTime: z
            .string()
            .min(1, { message: "Start time is required" })
            .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
                message: "Start time must be in HH:mm format",
            }),
    });

export type EventFormValues = z.infer<typeof eventSchema>;