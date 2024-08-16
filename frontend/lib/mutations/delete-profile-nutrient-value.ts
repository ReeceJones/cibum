import { graphql } from "../gql";

export const deleteProfileNutrientValueMutation = graphql(`
mutation DeleteProfileNutrientValueMutation($input: DeleteNodeInput!) {
  deleteProfileNutrientValue(input: $input) {
    success
  }
}
`)