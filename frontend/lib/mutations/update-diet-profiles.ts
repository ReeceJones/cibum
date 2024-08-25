import { graphql } from "../gql";

export const updateDietProfilesMutation = graphql(`
  mutation UpdateDietProfiles($input: UpdateDietProfilesInput!) {
    updateDietProfiles(input: $input) {
      id
    }
  }
`);
