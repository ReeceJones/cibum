import { graphql } from "../gql";

export const updateProfileIngredientCostMutation = graphql(`
  mutation UpdateProfileIngredientCost(
    $input: UpdateProfileIngredientCostInput!
  ) {
    updateProfileIngredientCost(input: $input) {
      id
    }
  }
`);
