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
        type
        mode
        operator
        literalValue
        ingredient {
          id
          name
        }
        ingredientCategory {
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
        referenceIngredientCategory {
          id
          name
        }
      }
      nutrientConstraints {
        id
        type
        mode
        operator
        literalValue
        nutrient {
          id
          name
        }
        nutrientCategory {
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
        referenceNutrientCategory {
          id
          name
        }
      }
      ingredientNutrientValues {
        id
        value
        unit {
          id
          symbol
        }
        ingredient {
          id
          name
        }
        nutrient {
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