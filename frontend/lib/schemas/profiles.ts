import { z } from "zod";
import { nodeId } from "./common";
import { ConstraintOperator, Ingredient, IngredientConstraintMode, Nutrient, NutrientConstraintMode, Unit } from "../gql/graphql";


export const profileIngredientConstraintSchema = z.object({
  id: z.string(),
  mode: z.nativeEnum(IngredientConstraintMode),
  operator: z.nativeEnum(ConstraintOperator),
  ingredient: nodeId<Ingredient>(),
  literalValue: z.coerce.number().optional(),
  literalUnit: nodeId<Unit>().optional(),
  referenceIngredient: nodeId<Ingredient>().optional(),
}).superRefine((data, ctx) => {
  switch (data.mode) {
    case IngredientConstraintMode.Ingredient:
      if (data.referenceIngredient === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["referenceIngredient"],
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
  mode: z.nativeEnum(NutrientConstraintMode),
  operator: z.nativeEnum(ConstraintOperator),
  nutrient: nodeId<Nutrient>(),
  literalValue: z.coerce.number().optional(),
  literalUnit: nodeId<Unit>().optional(),
  referenceNutrient: nodeId<Nutrient>().optional(),
}).superRefine((data, ctx) => {
  switch (data.mode) {
    case NutrientConstraintMode.Nutrient:
      if (data.referenceNutrient === undefined) {
        ctx.addIssue({
          message: "Required",
          code: z.ZodIssueCode.custom,
          path: ["referenceNutrient"],
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

export const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(300),
  description: z.string().min(1).max(300).or(z.literal("")).optional().transform(value => value === "" ? undefined : value),
  managed: z.boolean().default(false),
});
