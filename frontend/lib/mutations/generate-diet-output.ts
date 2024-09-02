import { graphql } from "../gql";

export const generateDietOutputMutaiton = graphql(`
  mutation GenerateDietOutput($input: GenerateDietOutputInput!) {
    generateDietOutput(input: $input) {
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
`);
