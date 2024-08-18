import { graphql } from "../gql";

export const deleteDietMutation = graphql(`
  mutation DeleteDiet($input: DeleteNodeInput!) {
    deleteDiet(input: $input) {
      success
    }
  }
`);
