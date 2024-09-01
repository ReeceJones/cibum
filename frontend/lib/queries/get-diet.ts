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
            }
            amount
            amountUnit {
              symbol
            }
            grossEnergy
            grossEnergyUnit {
              symbol
            }
            digestibleEnergy
            digestibleEnergyUnit {
              symbol
            }
            metabolizableEnergy
            metabolizableEnergyUnit {
              symbol
            }
            netEnergy
            netEnergyUnit {
              symbol
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
