import { graphql } from "../gql";

export const deleteNutrientCategoryMutation = graphql(`
mutation DeleteNutrientCategory($input: DeleteNodeInput!) {
  deleteNutrientCategory(input: $input) {
    success
  }
}
`);