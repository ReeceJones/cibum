import { graphql } from "../gql";

export const createIngredientCategoryMutation = graphql(`
mutation CreateIngredientCategory($input: CreateIngredientCategoryInput!) {
  createIngredientCategory(input: $input) {
    id
  }
}
`)