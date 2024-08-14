import { graphql } from "../gql";

export const getAllUnitsQuery = graphql(`
query GetAllUnits {
  units {
    edges {
      node {
        id
        name
        symbol
        kilogramMultiplier
        kilogramOffset
      }
    }
  }
}
`);

export function getAllUnitsKey() {
  return ["GetAllUnits"];
}