import { graphql } from "../gql";

export const deleteProfileConstraintMutation = graphql(`
  mutation DeleteProfileConstraint($input: DeleteNodeInput!) {
    deleteProfileConstraint(input: $input) {
      success
    }
  }
`);
