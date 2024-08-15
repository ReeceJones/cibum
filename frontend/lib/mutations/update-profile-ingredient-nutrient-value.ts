import { graphql } from "../gql";

export const updateProfileIngredientNutrientValueMutation = graphql(`
mutation UpdateProfileIngredientNutrientValue($input: UpdateProfileIngredientNutrientValueInput!) {
  updateProfileIngredientNutrientValue(input: $input) {
    id
  }
}  
`);