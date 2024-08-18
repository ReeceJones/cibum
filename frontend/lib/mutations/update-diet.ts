import { graphql } from "../gql";

export const updateDietMutation = graphql(`
  mutation UpdateDiet($input: UpdateDietInput!) {
    updateDiet(input: $input) {
      id
    }
  }
`);
