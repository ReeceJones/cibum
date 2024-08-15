import { graphql } from "../gql";

export const deleteProfileIngredientNutrientValueMutation = graphql(`
mutation DeleteProfileIngredientNutrientValue($input: DeleteNodeInput!) {
  deleteProfileIngredientNutrientValue(input: $input) {
    success
  }
}
`);