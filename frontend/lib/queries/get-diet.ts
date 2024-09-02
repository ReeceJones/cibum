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
        latestOutputVersion {
          id
          status
          version
          ingredientOutputs {
            id
            ingredient {
              name
            }
            cost
            costUnit {
              symbol
              baseUnitMultiplier
              baseUnitOffset
            }
            amount
            amountUnit {
              symbol
              baseUnitMultiplier
              baseUnitOffset
            }
            grossEnergy
            grossEnergyUnit {
              symbol
              baseUnitMultiplier
              baseUnitOffset
            }
            digestibleEnergy
            digestibleEnergyUnit {
              symbol
              baseUnitMultiplier
              baseUnitOffset
            }
            metabolizableEnergy
            metabolizableEnergyUnit {
              symbol
              baseUnitMultiplier
              baseUnitOffset
            }
            netEnergy
            netEnergyUnit {
              symbol
              baseUnitMultiplier
              baseUnitOffset
            }
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
