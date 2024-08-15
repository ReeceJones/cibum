import { graphql } from "../gql";

export const createProfileIngredientNutrientValueMutation = graphql(`
mutation CreateProfileIngredientNutrientValue($input: CreateProfileIngredientNutrientValueInput!) {
  createProfileIngredientNutrientValue(input: $input) {
    id
  }
}  
`)