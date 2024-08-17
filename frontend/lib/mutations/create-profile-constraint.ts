import { graphql } from "../gql";

export const createProfileConstraintMutation = graphql(`
  mutation CreateProfileConstraint($input: CreateProfileConstraintInput!) {
    createProfileConstraint(input: $input) {
      id
    }
  }
`);
