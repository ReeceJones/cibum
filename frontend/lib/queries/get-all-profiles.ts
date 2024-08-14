import { graphql } from "../gql";

export const getAllProfilesQuery = graphql(`
query GetAllProfiles {
  profiles {
    edges {
      node {
        id
        name
        description
        managed
      }
    }
  }
}
`);

export function getAllProfilesKey({
  orgId
}: {
  orgId: string;
}) {
  return ["GetAllProfiles", {orgId}];
}
