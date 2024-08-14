import { graphql } from "../gql";

export const deleteProfileIngredientConstraintMutation = graphql(`
mutation DeleteProfileIngredientConstraint($input: DeleteNodeInput!) {
  deleteProfileIngredientConstraint(input: $input) {
    success
  }
}
`);