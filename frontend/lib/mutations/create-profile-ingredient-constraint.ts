import { graphql } from "../gql";

export const createProfileIngredientConstraintMutation = graphql(`
mutation CreateProfileIngredientConstraint($input: CreateProfileIngredientConstraintInput!) {
  createProfileIngredientConstraint(input: $input) {
    id
  }
}
`)