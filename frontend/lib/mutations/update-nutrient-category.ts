import { graphql } from "../gql";

export const updateNutrientCategoryMutation = graphql(`
mutation UpdateNutrientCategory($input: UpdateNutrientCategoryInput!) {
  updateNutrientCategory(input: $input) {
    id
  }
}
`);