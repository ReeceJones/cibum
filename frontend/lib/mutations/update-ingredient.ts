import { graphql } from "../gql";

export const updateIngredientMutation = graphql(`
mutation UpdateIngredient($input: UpdateIngredientInput!) {
  updateIngredient(input: $input) {
    id
  }
}
`);