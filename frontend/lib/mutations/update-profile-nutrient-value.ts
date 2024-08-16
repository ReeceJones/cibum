import { graphql } from "../gql";

export const updateProfileNutrientValueMutation = graphql(`
mutation UpdateProfileNutrientValue($input: UpdateProfileNutrientValueInput!) {
  updateProfileNutrientValue(input: $input) {
    id
  }
}  
`)