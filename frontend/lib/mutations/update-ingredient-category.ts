import { graphql } from "../gql";

export const updateIngredientCategoryMutation = graphql(`
mutation UpdateIngredientCategory($input: UpdateIngredientCategoryInput!) {
  updateIngredientCategory(input: $input) {
    id
  }
}
`);