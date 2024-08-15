import { z } from "zod";
import { nodeId } from "./common";
import { ConstraintOperator, Ingredient, IngredientCategory, IngredientConstraintMode, IngredientConstraintType, Nutrient, NutrientCategory, NutrientConstraintMode, NutrientConstraintType, Unit } from "../gql/graphql";


export const profileIngredientConstraintSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(IngredientConstraintType),
  mode: z.nativeEnum(IngredientConstraintMode),
  operator: z.nativeEnum(ConstraintOperator),
  ingredient: nodeId<Ingredient>().optional(),
  ingredientCategory: nodeId<IngredientCategory>().optional(),
  literalValue: z.coerce.number().optional(),
  literalUnit: nodeId<Unit>().optional(),
  referenceIngredient: nodeId<Ingredient>().optional(),
  referenceIngredientCategory: nodeId<IngredientCategory>().optional(),
}).superRefine((data, ctx) => {
  switch (data.mode) {
    case IngredientConstraintMode.Reference:
      if (data.type === IngredientConstraintType.Ingredient && data.referenceIngredient === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["referenceIngredient"],
        });
      }
      if (data.type === IngredientConstraintType.IngredientCategory && data.referenceIngredientCategory === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["referenceIngredientCategory"]
        });
      }
      break;
    case IngredientConstraintMode.Literal:
      if (data.literalValue === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["literalValue"],
        });
      }
      if (data.literalUnit === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["literalUnit"],
        });
      }
    break;
  }
});

export const profileNutrientConstraintSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NutrientConstraintType),
  mode: z.nativeEnum(NutrientConstraintMode),
  operator: z.nativeEnum(ConstraintOperator),
  nutrient: nodeId<Nutrient>().optional(),
  nutrientCategory: nodeId<NutrientCategory>().optional(),
  literalValue: z.coerce.number().optional(),
  literalUnit: nodeId<Unit>().optional(),
  referenceNutrient: nodeId<Nutrient>().optional(),
  referenceNutrientCategory: nodeId<NutrientCategory>().optional(),
}).superRefine((data, ctx) => {
  switch (data.mode) {
    case NutrientConstraintMode.Reference:
      if (data.type === NutrientConstraintType.Nutrient && data.referenceNutrient === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["referenceNutrient"],
        });
      }
      if (data.type === NutrientConstraintType.NutrientCategory && data.referenceNutrientCategory === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["referenceNutrientCategory"],
        });
      }
      break;
    case NutrientConstraintMode.Literal:
      if (data.literalValue === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["literalValue"],
        });
      }
      if (data.literalUnit === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["literalUnit"],
        });
      }
    break;
  }
});

export const profileIngredientNutrientValueSchema = z.object({
  id: z.string(),
  ingredient: nodeId<Ingredient>(),
  nutrient: nodeId<Nutrient>(),
  value: z.coerce.number().min(0),
  unit: nodeId<Unit>(),
})

export const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(300).or(z.literal("")).optional().transform(value => value === "" ? undefined : value),
  managed: z.boolean().default(false),
});
