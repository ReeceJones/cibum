import { graphql } from "../gql";

export const createIngredientMutation = graphql(`
mutation CreateIngredient($input: CreateIngredientInput!) {
  createIngredient(input: $input) {
    id
  }
}
`)