import { graphql } from "../gql";

export const createProfileNutrientValueMutation = graphql(`
mutation CreateProfileNutrientValue($input: CreateProfileNutrientValueInput!) {
  createProfileNutrientValue(input: $input) {
    id
  }
}  
`)