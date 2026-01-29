import { z } from "zod";

export const foodSchema = z.object({
  inHouseRestaurant: z.boolean(),
  roomService: z.boolean(),
  foodType: z.enum(["VEG", "NON-VEG", "BOTH"], {
    required_error: "Please select food type",
  }),
});

export type FoodFormValues = z.infer<typeof foodSchema>;
