import { graphql } from "../gql";

export const updateProfileMutation = graphql(`
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    name
    description
  }
}
`);