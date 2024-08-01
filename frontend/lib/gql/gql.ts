/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nmutation CreateIngredientCategory($input: CreateIngredientCategoryInput!) {\n  createIngredientCategory(input: $input) {\n    id\n  }\n}\n": types.CreateIngredientCategoryDocument,
    "\nmutation CreateIngredient($input: CreateIngredientInput!) {\n  createIngredient(input: $input) {\n    id\n  }\n}\n": types.CreateIngredientDocument,
    "\nmutation CreateNutrientCategory($input: CreateNutrientCategoryInput!) {\n  createNutrientCategory(input: $input) {\n    id\n  }\n}\n": types.CreateNutrientCategoryDocument,
    "\nmutation CreateNutrient($input: CreateNutrientInput!) {\n  createNutrient(input: $input) {\n    id\n  }\n}\n": types.CreateNutrientDocument,
    "\nmutation DeleteIngredientCategory($input: DeleteNodeInput!) {\n  deleteIngredientCategory(input: $input) {\n    success\n  }\n}\n": types.DeleteIngredientCategoryDocument,
    "\nmutation DeleteIngredient($input: DeleteNodeInput!) {\n  deleteIngredient(input: $input) {\n    success\n  }\n}\n": types.DeleteIngredientDocument,
    "\nmutation DeleteNutrientCategory($input: DeleteNodeInput!) {\n  deleteNutrientCategory(input: $input) {\n    success\n  }\n}\n": types.DeleteNutrientCategoryDocument,
    "\nmutation DeleteNutrient($input: DeleteNodeInput!) {\n  deleteNutrient(input: $input) {\n    success\n  }\n}\n": types.DeleteNutrientDocument,
    "\nmutation UpdateIngredientCategory($input: UpdateIngredientCategoryInput!) {\n  updateIngredientCategory(input: $input) {\n    id\n  }\n}\n": types.UpdateIngredientCategoryDocument,
    "\nmutation UpdateIngredient($input: UpdateIngredientInput!) {\n  updateIngredient(input: $input) {\n    id\n  }\n}\n": types.UpdateIngredientDocument,
    "\nmutation UpdateNutrientCategory($input: UpdateNutrientCategoryInput!) {\n  updateNutrientCategory(input: $input) {\n    id\n  }\n}\n": types.UpdateNutrientCategoryDocument,
    "\nmutation UpdateNutrient($input: UpdateNutrientInput!) {\n  updateNutrient(input: $input) {\n    id\n  }\n}\n": types.UpdateNutrientDocument,
    "\nquery GetAllIngredientsAndCategories {\n  ingredients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        ingredientCategoryId\n        nutrients {\n          edges {\n            node {\n              nutrient {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  ingredientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentIngredientCategoryId\n        managed\n      }\n    }\n  }\n}\n": types.GetAllIngredientsAndCategoriesDocument,
    "\nquery GetAllNutrientsAndCategories {\n  nutrients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        nutrientCategoryId\n      }\n    }\n  }\n  nutrientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentNutrientCategoryId\n        managed\n      }\n    }\n  }\n}\n": types.GetAllNutrientsAndCategoriesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateIngredientCategory($input: CreateIngredientCategoryInput!) {\n  createIngredientCategory(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateIngredientCategory($input: CreateIngredientCategoryInput!) {\n  createIngredientCategory(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateIngredient($input: CreateIngredientInput!) {\n  createIngredient(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateIngredient($input: CreateIngredientInput!) {\n  createIngredient(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateNutrientCategory($input: CreateNutrientCategoryInput!) {\n  createNutrientCategory(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateNutrientCategory($input: CreateNutrientCategoryInput!) {\n  createNutrientCategory(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateNutrient($input: CreateNutrientInput!) {\n  createNutrient(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateNutrient($input: CreateNutrientInput!) {\n  createNutrient(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteIngredientCategory($input: DeleteNodeInput!) {\n  deleteIngredientCategory(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteIngredientCategory($input: DeleteNodeInput!) {\n  deleteIngredientCategory(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteIngredient($input: DeleteNodeInput!) {\n  deleteIngredient(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteIngredient($input: DeleteNodeInput!) {\n  deleteIngredient(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteNutrientCategory($input: DeleteNodeInput!) {\n  deleteNutrientCategory(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteNutrientCategory($input: DeleteNodeInput!) {\n  deleteNutrientCategory(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteNutrient($input: DeleteNodeInput!) {\n  deleteNutrient(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteNutrient($input: DeleteNodeInput!) {\n  deleteNutrient(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateIngredientCategory($input: UpdateIngredientCategoryInput!) {\n  updateIngredientCategory(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation UpdateIngredientCategory($input: UpdateIngredientCategoryInput!) {\n  updateIngredientCategory(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateIngredient($input: UpdateIngredientInput!) {\n  updateIngredient(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation UpdateIngredient($input: UpdateIngredientInput!) {\n  updateIngredient(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateNutrientCategory($input: UpdateNutrientCategoryInput!) {\n  updateNutrientCategory(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation UpdateNutrientCategory($input: UpdateNutrientCategoryInput!) {\n  updateNutrientCategory(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateNutrient($input: UpdateNutrientInput!) {\n  updateNutrient(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation UpdateNutrient($input: UpdateNutrientInput!) {\n  updateNutrient(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetAllIngredientsAndCategories {\n  ingredients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        ingredientCategoryId\n        nutrients {\n          edges {\n            node {\n              nutrient {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  ingredientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentIngredientCategoryId\n        managed\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetAllIngredientsAndCategories {\n  ingredients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        ingredientCategoryId\n        nutrients {\n          edges {\n            node {\n              nutrient {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  ingredientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentIngredientCategoryId\n        managed\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetAllNutrientsAndCategories {\n  nutrients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        nutrientCategoryId\n      }\n    }\n  }\n  nutrientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentNutrientCategoryId\n        managed\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetAllNutrientsAndCategories {\n  nutrients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        nutrientCategoryId\n      }\n    }\n  }\n  nutrientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentNutrientCategoryId\n        managed\n      }\n    }\n  }\n}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;