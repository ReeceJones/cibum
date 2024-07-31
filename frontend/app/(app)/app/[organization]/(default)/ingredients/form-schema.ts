import { z } from "zod";


export const ingredientCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(300).or(z.literal("")).optional().transform(value => value === "" ? undefined : value),
  parent_id: z.string().nullish(),
  managed: z.boolean().default(false),
});

export const ingredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(300).or(z.literal("")).optional().transform(value => value === "" ? undefined : value),
  ingredient_category_id: z.string().nullish(),
  managed: z.boolean().default(false),
});

export const ingredientFormSchema = z.object({
  categories: z.array(ingredientCategorySchema),
  ingredients: z.array(ingredientSchema),
});