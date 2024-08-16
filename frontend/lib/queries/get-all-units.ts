import { graphql } from "../gql";

export const getAllUnitsQuery = graphql(`
  query GetAllUnits {
    units {
      edges {
        node {
          id
          name
          type
          symbol
          baseUnitMultiplier
          baseUnitOffset
        }
      }
    }
  }
`);

export function getAllUnitsKey() {
  return ["GetAllUnits"];
}
