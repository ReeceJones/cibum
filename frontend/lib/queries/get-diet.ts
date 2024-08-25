import { graphql } from "../gql";

export const getDietQuery = graphql(`
  query GetDiet($dietId: GlobalID!) {
    node(id: $dietId) {
      ... on Diet {
        id
        name
        description
        latestConfigurationVersion {
          profiles {
            id
            name
            description
          }
        }
      }
    }
  }
`);

export const getDietKey = ({ dietId }: { dietId: string }) => [
  "GetDiet",
  { dietId },
];
