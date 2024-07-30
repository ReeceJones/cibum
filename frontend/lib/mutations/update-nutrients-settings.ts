import { graphql } from "../gql";

export const updateNutrientSettingsMutation = graphql(`
mutation UpdateNutrientSettings($input: UpdateNutrientSettingsInput!) {
  updateNutrientSettings(input: $input) {
    success
  }
}  
`);