import { graphql } from "../gql";

export const createNutrientMutation = graphql(`
mutation CreateNutrient($input: CreateNutrientInput!) {
  createNutrient(input: $input) {
    id
  }
}
`);