import { z } from "zod";

export const dietSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z
    .string()
    .min(1)
    .max(300)
    .or(z.literal(""))
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});
