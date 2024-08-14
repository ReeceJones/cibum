import { graphql } from "../gql";

export const deleteProfileNutrientConstraintMutation = graphql(`
mutation DeleteProfileNutrientConstraint($input: DeleteNodeInput!) {
  deleteProfileNutrientConstraint(input: $input) {
    success
  }
}
`);