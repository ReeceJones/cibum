import { graphql } from "../gql";

export const getProfileQuery = graphql(`
query GetProfile($profileId: GlobalID!) {
  node(id: $profileId) {
    ... on Profile {
      id
      name
      description
      ingredientConstraints {
        id
        mode
        operator
        literalValue
        ingredient {
          id
          name
        }
        literalUnit {
          id
          symbol
        }
        referenceIngredient {
          id
          name
        }
      }
      nutrientConstraints {
        id
        mode
        operator
        literalValue
        nutrient {
          id
          name
        }
        literalUnit {
          id
          symbol
        }
        referenceNutrient {
          id
          name
        }
      }
    }
  }
}
`)

export function getProfileKey({ profileId }: { profileId: string}) {
  return ["GetProfile", { profileId }];
}