import { graphql } from "../gql";

export const createDietMutation = graphql(`
  mutation CreateDiet($input: CreateDietInput!) {
    createDiet(input: $input) {
      id
    }
  }
`);
