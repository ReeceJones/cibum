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
`);
