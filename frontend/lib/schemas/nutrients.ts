import { z } from "zod";


export const nutrientCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(300).or(z.literal("")).optional().transform(value => value === "" ? undefined : value),
  parent_id: z.string().nullish(),
  managed: z.boolean().default(false),
});

export const nutrientSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(300).or(z.literal("")).optional().transform(value => value === "" ? undefined : value),
  nutrient_category_id: z.string().nullish(),
  managed: z.boolean().default(false),
});

export const nutrientFormSchema = z.object({
  categories: z.array(nutrientCategorySchema),
  nutrients: z.array(nutrientSchema),
});