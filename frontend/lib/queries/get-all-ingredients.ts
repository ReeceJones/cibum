import { graphql } from "../gql";

export const getAllIngredientsQuery = graphql(`
query GetAllIngredientsAndCategories {
  ingredients {
    edges {
      node {
        id
        name
        description
        managed
        ingredientCategoryId
      }
    }
  }
  ingredientCategories {
    edges {
      node {
        id
        name
        description
        parentIngredientCategoryId
        managed
      }
    }
  }
}
`);

export function getAllIngredientsKey({
  orgId
}: {
  orgId: string;
}) {
  return ["GetAllIngredients", {orgId}];
}