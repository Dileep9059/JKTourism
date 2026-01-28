import { z } from "zod";

const roomTypeSchema = z.object({
    roomType: z.string().min(1, "Room type is required"),
    roomCount: z
        .number({ invalid_type_error: "Enter room count" })
        .min(1, "At least 1 room"),
    tariff: z
        .number({ invalid_type_error: "Enter tariff" })
        .min(1, "Tariff must be greater than 0"),
});

export const propertyDetailsSchema = z.object({
    checkInTime: z.string().min(1, "Check-in time is required"),
    checkOutTime: z.string().min(1, "Check-out time is required"),
    parkingCapacity: z
        .number({ invalid_type_error: "Enter parking capacity" })
        .min(0, "Invalid parking capacity"),

    liftAvailable: z.boolean(),
    powerBackup: z.boolean(),
    wheelchairAccessible: z.boolean(),

    roomTypes: z
        .array(roomTypeSchema)
        .min(1, "At least one room type is required"),
});

export type PropertyDetailsFormValues = z.infer<
    typeof propertyDetailsSchema
>;
