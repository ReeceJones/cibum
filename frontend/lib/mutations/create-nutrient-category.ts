import { graphql } from "../gql";

export const createNutrientCategoryMutation = graphql(`
mutation CreateNutrientCategory($input: CreateNutrientCategoryInput!) {
  createNutrientCategory(input: $input) {
    id
  }
}
`)