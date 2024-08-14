import { graphql } from "../gql";

export const createProfileNutrientConstraintMutation = graphql(`
mutation CreateProfileNutrientConstraint($input: CreateProfileNutrientConstraintInput!) {
  createProfileNutrientConstraint(input: $input) {
    id
  }
}
`)