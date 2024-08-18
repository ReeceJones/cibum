import { graphql } from "../gql";

export const getAllDietsQuery = graphql(`
  query GetAllDiets {
    diets {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`);

export function getAllDietsKey({ orgId }: { orgId: string }) {
  return ["GetAllDiets", { orgId }];
}
