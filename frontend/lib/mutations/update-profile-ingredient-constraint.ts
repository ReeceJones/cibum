import { graphql } from "../gql";

export const updateProfileIngredientConstraintMutation = graphql(`
mutation UpdateProfileIngredientConstraint($input: UpdateProfileIngredientConstraintInput!) {
  updateProfileIngredientConstraint(input: $input) {
    id
  }
}
`)