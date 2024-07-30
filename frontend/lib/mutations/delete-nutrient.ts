import { graphql } from "../gql";

export const deleteNutrientMutation = graphql(`
mutation DeleteNutrient($input: DeleteNodeInput!) {
  deleteNutrient(input: $input) {
    success
  }
}
`);