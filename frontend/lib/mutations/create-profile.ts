import { graphql } from "../gql";

export const createProfileMutation = graphql(`
mutation CreateProfile($input: CreateProfileInput!) {
  createProfile(input: $input) {
    id
  }
}
`);