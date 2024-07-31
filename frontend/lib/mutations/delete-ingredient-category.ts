import { graphql } from "../gql";

export const deleteIngredientCategoryMutation = graphql(`
mutation DeleteIngredientCategory($input: DeleteNodeInput!) {
  deleteIngredientCategory(input: $input) {
    success
  }
}
`)