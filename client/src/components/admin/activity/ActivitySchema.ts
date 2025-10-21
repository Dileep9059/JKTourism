import { z } from "zod";

export const activitySchema = z.object({
    title: z
        .string()
        .nonempty("Title is required")
        .regex(/^[A-Za-z\s]+$/, "Title must contain only letters"),

    content: z
        .string()
        .nonempty("Content is required")
        .refine((val) => val.replace(/<[^>]+>/g, "").trim().length > 0, {
            message: "Content must not be empty",
        }),

    description: z
        .string()
        .nonempty("Description is required"),

   images: z
    .array(
      z.object({
        id: z.string(),
        file: z
          .custom<File | null>((file) => file instanceof File && file.size > 0, {
            message: "Image file is required",
          }),
        preview: z.string().optional(),
      })
    )
    .min(1, "At least one image is required"),
});

export type ActivitySchema = z.infer<typeof activitySchema>;
