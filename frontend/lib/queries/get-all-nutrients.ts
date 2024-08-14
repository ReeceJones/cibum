import { graphql } from "../gql";

export const getAllNutrientsQuery = graphql(`
query GetAllNutrientsAndCategories {
  nutrients {
    edges {
      node {
        id
        name
        description
        managed
        nutrientCategoryId
      }
    }
  }
  nutrientCategories {
    edges {
      node {
        id
        name
        description
        parentNutrientCategoryId
        managed
      }
    }
  }
}
`);

export function getAllNutrientsKey({
  orgId
}: {
  orgId: string;
}) {
  return ["GetAllNutrients", {orgId}];
}
