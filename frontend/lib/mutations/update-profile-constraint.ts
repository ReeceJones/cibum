import { graphql } from "../gql";

export const updateProfileConstraintMutation = graphql(`
  mutation UpdateProfileConstraint($input: UpdateProfileConstraintInput!) {
    updateProfileConstraint(input: $input) {
      id
    }
  }
`);
