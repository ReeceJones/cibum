import { graphql } from "../gql";

export const updateNutrientMutation = graphql(`
mutation UpdateNutrient($input: UpdateNutrientInput!) {
  updateNutrient(input: $input) {
    id
  }
}
`);  