import { graphql } from "../gql";

export const deleteProfileMutation = graphql(`
mutation DeleteProfile($input: DeleteNodeInput!) {
  deleteProfile(input: $input) {
    success
  }
}
`);