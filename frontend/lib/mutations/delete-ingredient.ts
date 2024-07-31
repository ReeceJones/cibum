import { graphql } from "../gql";

export const deleteIngredientMutation = graphql(`
mutation DeleteIngredient($input: DeleteNodeInput!) {
  deleteIngredient(input: $input) {
    success
  }
}
`)