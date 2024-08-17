import { graphql } from "../gql";

export const deleteProfileIngredientCostMutation = graphql(`
  mutation DeleteProfileIngredientCost($input: DeleteNodeInput!) {
    deleteProfileIngredientCost(input: $input) {
      success
    }
  }
`);
