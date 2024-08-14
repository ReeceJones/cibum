import { graphql } from "../gql";

export const updateProfileNutrientConstraintMutation = graphql(`
mutation UpdateProfileNutrientConstraint($input: UpdateProfileNutrientConstraintInput!) {
  updateProfileNutrientConstraint(input: $input) {
    id
  }
}
`)