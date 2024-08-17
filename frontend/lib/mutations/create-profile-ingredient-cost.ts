import { graphql } from "../gql";

export const createProfileIngredientCostMutation = graphql(`
  mutation CreateProfileIngredientCost(
    $input: CreateProfileIngredientCostInput!
  ) {
    createProfileIngredientCost(input: $input) {
      id
    }
  }
`);
