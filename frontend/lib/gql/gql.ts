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
    "\n  mutation CreateDiet($input: CreateDietInput!) {\n    createDiet(input: $input) {\n      id\n    }\n  }\n": types.CreateDietDocument,
    "\nmutation CreateIngredientCategory($input: CreateIngredientCategoryInput!) {\n  createIngredientCategory(input: $input) {\n    id\n  }\n}\n": types.CreateIngredientCategoryDocument,
    "\nmutation CreateIngredient($input: CreateIngredientInput!) {\n  createIngredient(input: $input) {\n    id\n  }\n}\n": types.CreateIngredientDocument,
    "\nmutation CreateNutrientCategory($input: CreateNutrientCategoryInput!) {\n  createNutrientCategory(input: $input) {\n    id\n  }\n}\n": types.CreateNutrientCategoryDocument,
    "\nmutation CreateNutrient($input: CreateNutrientInput!) {\n  createNutrient(input: $input) {\n    id\n  }\n}\n": types.CreateNutrientDocument,
    "\n  mutation CreateProfileConstraint($input: CreateProfileConstraintInput!) {\n    createProfileConstraint(input: $input) {\n      id\n    }\n  }\n": types.CreateProfileConstraintDocument,
    "\nmutation CreateProfileIngredientConstraint($input: CreateProfileIngredientConstraintInput!) {\n  createProfileIngredientConstraint(input: $input) {\n    id\n  }\n}\n": types.CreateProfileIngredientConstraintDocument,
    "\n  mutation CreateProfileIngredientCost(\n    $input: CreateProfileIngredientCostInput!\n  ) {\n    createProfileIngredientCost(input: $input) {\n      id\n    }\n  }\n": types.CreateProfileIngredientCostDocument,
    "\nmutation CreateProfileIngredientNutrientValue($input: CreateProfileIngredientNutrientValueInput!) {\n  createProfileIngredientNutrientValue(input: $input) {\n    id\n  }\n}  \n": types.CreateProfileIngredientNutrientValueDocument,
    "\nmutation CreateProfileNutrientConstraint($input: CreateProfileNutrientConstraintInput!) {\n  createProfileNutrientConstraint(input: $input) {\n    id\n  }\n}\n": types.CreateProfileNutrientConstraintDocument,
    "\nmutation CreateProfileNutrientValue($input: CreateProfileNutrientValueInput!) {\n  createProfileNutrientValue(input: $input) {\n    id\n  }\n}  \n": types.CreateProfileNutrientValueDocument,
    "\nmutation CreateProfile($input: CreateProfileInput!) {\n  createProfile(input: $input) {\n    id\n  }\n}\n": types.CreateProfileDocument,
    "\n  mutation DeleteDiet($input: DeleteNodeInput!) {\n    deleteDiet(input: $input) {\n      success\n    }\n  }\n": types.DeleteDietDocument,
    "\nmutation DeleteIngredientCategory($input: DeleteNodeInput!) {\n  deleteIngredientCategory(input: $input) {\n    success\n  }\n}\n": types.DeleteIngredientCategoryDocument,
    "\nmutation DeleteIngredient($input: DeleteNodeInput!) {\n  deleteIngredient(input: $input) {\n    success\n  }\n}\n": types.DeleteIngredientDocument,
    "\nmutation DeleteNutrientCategory($input: DeleteNodeInput!) {\n  deleteNutrientCategory(input: $input) {\n    success\n  }\n}\n": types.DeleteNutrientCategoryDocument,
    "\nmutation DeleteNutrient($input: DeleteNodeInput!) {\n  deleteNutrient(input: $input) {\n    success\n  }\n}\n": types.DeleteNutrientDocument,
    "\n  mutation DeleteProfileConstraint($input: DeleteNodeInput!) {\n    deleteProfileConstraint(input: $input) {\n      success\n    }\n  }\n": types.DeleteProfileConstraintDocument,
    "\nmutation DeleteProfileIngredientConstraint($input: DeleteNodeInput!) {\n  deleteProfileIngredientConstraint(input: $input) {\n    success\n  }\n}\n": types.DeleteProfileIngredientConstraintDocument,
    "\n  mutation DeleteProfileIngredientCost($input: DeleteNodeInput!) {\n    deleteProfileIngredientCost(input: $input) {\n      success\n    }\n  }\n": types.DeleteProfileIngredientCostDocument,
    "\nmutation DeleteProfileIngredientNutrientValue($input: DeleteNodeInput!) {\n  deleteProfileIngredientNutrientValue(input: $input) {\n    success\n  }\n}\n": types.DeleteProfileIngredientNutrientValueDocument,
    "\nmutation DeleteProfileNutrientConstraint($input: DeleteNodeInput!) {\n  deleteProfileNutrientConstraint(input: $input) {\n    success\n  }\n}\n": types.DeleteProfileNutrientConstraintDocument,
    "\nmutation DeleteProfileNutrientValueMutation($input: DeleteNodeInput!) {\n  deleteProfileNutrientValue(input: $input) {\n    success\n  }\n}\n": types.DeleteProfileNutrientValueMutationDocument,
    "\nmutation DeleteProfile($input: DeleteNodeInput!) {\n  deleteProfile(input: $input) {\n    success\n  }\n}\n": types.DeleteProfileDocument,
    "\n  mutation GenerateDietOutput($input: GenerateDietOutputInput!) {\n    generateDietOutput(input: $input) {\n      id\n      status\n      version\n      ingredientOutputs {\n        id\n        ingredient {\n          name\n        }\n        cost\n        costUnit {\n          symbol\n        }\n        amount\n        amountUnit {\n          symbol\n        }\n      }\n    }\n  }\n": types.GenerateDietOutputDocument,
    "\n  mutation UpdateDietProfiles($input: UpdateDietProfilesInput!) {\n    updateDietProfiles(input: $input) {\n      id\n    }\n  }\n": types.UpdateDietProfilesDocument,
    "\n  mutation UpdateDiet($input: UpdateDietInput!) {\n    updateDiet(input: $input) {\n      id\n    }\n  }\n": types.UpdateDietDocument,
    "\nmutation UpdateIngredientCategory($input: UpdateIngredientCategoryInput!) {\n  updateIngredientCategory(input: $input) {\n    id\n  }\n}\n": types.UpdateIngredientCategoryDocument,
    "\nmutation UpdateIngredient($input: UpdateIngredientInput!) {\n  updateIngredient(input: $input) {\n    id\n  }\n}\n": types.UpdateIngredientDocument,
    "\nmutation UpdateNutrientCategory($input: UpdateNutrientCategoryInput!) {\n  updateNutrientCategory(input: $input) {\n    id\n  }\n}\n": types.UpdateNutrientCategoryDocument,
    "\nmutation UpdateNutrient($input: UpdateNutrientInput!) {\n  updateNutrient(input: $input) {\n    id\n  }\n}\n": types.UpdateNutrientDocument,
    "\n  mutation UpdateProfileConstraint($input: UpdateProfileConstraintInput!) {\n    updateProfileConstraint(input: $input) {\n      id\n    }\n  }\n": types.UpdateProfileConstraintDocument,
    "\nmutation UpdateProfileIngredientConstraint($input: UpdateProfileIngredientConstraintInput!) {\n  updateProfileIngredientConstraint(input: $input) {\n    id\n  }\n}\n": types.UpdateProfileIngredientConstraintDocument,
    "\n  mutation UpdateProfileIngredientCost(\n    $input: UpdateProfileIngredientCostInput!\n  ) {\n    updateProfileIngredientCost(input: $input) {\n      id\n    }\n  }\n": types.UpdateProfileIngredientCostDocument,
    "\nmutation UpdateProfileIngredientNutrientValue($input: UpdateProfileIngredientNutrientValueInput!) {\n  updateProfileIngredientNutrientValue(input: $input) {\n    id\n  }\n}  \n": types.UpdateProfileIngredientNutrientValueDocument,
    "\nmutation UpdateProfileNutrientConstraint($input: UpdateProfileNutrientConstraintInput!) {\n  updateProfileNutrientConstraint(input: $input) {\n    id\n  }\n}\n": types.UpdateProfileNutrientConstraintDocument,
    "\nmutation UpdateProfileNutrientValue($input: UpdateProfileNutrientValueInput!) {\n  updateProfileNutrientValue(input: $input) {\n    id\n  }\n}  \n": types.UpdateProfileNutrientValueDocument,
    "\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    description\n  }\n}\n": types.UpdateProfileDocument,
    "\n  query GetAllDiets {\n    diets {\n      edges {\n        node {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n": types.GetAllDietsDocument,
    "\nquery GetAllIngredientsAndCategories {\n  ingredients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        ingredientCategoryId\n      }\n    }\n  }\n  ingredientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentIngredientCategoryId\n        managed\n      }\n    }\n  }\n}\n": types.GetAllIngredientsAndCategoriesDocument,
    "\nquery GetAllNutrientsAndCategories {\n  nutrients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        nutrientCategoryId\n      }\n    }\n  }\n  nutrientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentNutrientCategoryId\n        managed\n      }\n    }\n  }\n}\n": types.GetAllNutrientsAndCategoriesDocument,
    "\nquery GetAllProfiles {\n  profiles {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n      }\n    }\n  }\n}\n": types.GetAllProfilesDocument,
    "\n  query GetAllUnits {\n    units {\n      edges {\n        node {\n          id\n          name\n          type\n          symbol\n          baseUnitMultiplier\n          baseUnitOffset\n        }\n      }\n    }\n  }\n": types.GetAllUnitsDocument,
    "\n  query GetDiet($dietId: GlobalID!) {\n    node(id: $dietId) {\n      ... on Diet {\n        id\n        name\n        description\n        latestConfigurationVersion {\n          profiles {\n            id\n            name\n            description\n          }\n        }\n      }\n    }\n  }\n": types.GetDietDocument,
    "\n  query GetProfile($profileId: GlobalID!) {\n    node(id: $profileId) {\n      ... on Profile {\n        id\n        name\n        description\n        ingredientConstraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          ingredient {\n            id\n            name\n          }\n          ingredientCategory {\n            id\n            name\n          }\n          literalUnit {\n            id\n            symbol\n          }\n          referenceIngredient {\n            id\n            name\n          }\n          referenceIngredientCategory {\n            id\n            name\n          }\n        }\n        nutrientConstraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          nutrient {\n            id\n            name\n          }\n          nutrientCategory {\n            id\n            name\n          }\n          literalUnit {\n            id\n            symbol\n          }\n          referenceNutrient {\n            id\n            name\n          }\n          referenceNutrientCategory {\n            id\n            name\n          }\n        }\n        ingredientNutrientValues {\n          id\n          value\n          unit {\n            id\n            symbol\n          }\n          ingredient {\n            id\n            name\n          }\n          nutrient {\n            id\n            name\n          }\n        }\n        nutrientValues {\n          id\n          grossEnergy\n          digestibleEnergy\n          metabolizableEnergy\n          netEnergy\n          nutrient {\n            id\n            name\n          }\n          grossEnergyUnit {\n            id\n            symbol\n          }\n          digestibleEnergyUnit {\n            id\n            symbol\n          }\n          metabolizableEnergyUnit {\n            id\n            symbol\n          }\n          netEnergyUnit {\n            id\n            symbol\n          }\n        }\n        ingredientCosts {\n          id\n          mode\n          ingredient {\n            id\n            name\n          }\n          literalCost\n          literalCostUnit {\n            id\n            symbol\n          }\n        }\n        constraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          literalUnit {\n            id\n            symbol\n          }\n        }\n      }\n    }\n  }\n": types.GetProfileDocument,
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
export function graphql(source: "\n  mutation CreateDiet($input: CreateDietInput!) {\n    createDiet(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDiet($input: CreateDietInput!) {\n    createDiet(input: $input) {\n      id\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation CreateProfileConstraint($input: CreateProfileConstraintInput!) {\n    createProfileConstraint(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProfileConstraint($input: CreateProfileConstraintInput!) {\n    createProfileConstraint(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateProfileIngredientConstraint($input: CreateProfileIngredientConstraintInput!) {\n  createProfileIngredientConstraint(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateProfileIngredientConstraint($input: CreateProfileIngredientConstraintInput!) {\n  createProfileIngredientConstraint(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProfileIngredientCost(\n    $input: CreateProfileIngredientCostInput!\n  ) {\n    createProfileIngredientCost(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProfileIngredientCost(\n    $input: CreateProfileIngredientCostInput!\n  ) {\n    createProfileIngredientCost(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateProfileIngredientNutrientValue($input: CreateProfileIngredientNutrientValueInput!) {\n  createProfileIngredientNutrientValue(input: $input) {\n    id\n  }\n}  \n"): (typeof documents)["\nmutation CreateProfileIngredientNutrientValue($input: CreateProfileIngredientNutrientValueInput!) {\n  createProfileIngredientNutrientValue(input: $input) {\n    id\n  }\n}  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateProfileNutrientConstraint($input: CreateProfileNutrientConstraintInput!) {\n  createProfileNutrientConstraint(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateProfileNutrientConstraint($input: CreateProfileNutrientConstraintInput!) {\n  createProfileNutrientConstraint(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateProfileNutrientValue($input: CreateProfileNutrientValueInput!) {\n  createProfileNutrientValue(input: $input) {\n    id\n  }\n}  \n"): (typeof documents)["\nmutation CreateProfileNutrientValue($input: CreateProfileNutrientValueInput!) {\n  createProfileNutrientValue(input: $input) {\n    id\n  }\n}  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateProfile($input: CreateProfileInput!) {\n  createProfile(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation CreateProfile($input: CreateProfileInput!) {\n  createProfile(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteDiet($input: DeleteNodeInput!) {\n    deleteDiet(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteDiet($input: DeleteNodeInput!) {\n    deleteDiet(input: $input) {\n      success\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation DeleteProfileConstraint($input: DeleteNodeInput!) {\n    deleteProfileConstraint(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProfileConstraint($input: DeleteNodeInput!) {\n    deleteProfileConstraint(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteProfileIngredientConstraint($input: DeleteNodeInput!) {\n  deleteProfileIngredientConstraint(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteProfileIngredientConstraint($input: DeleteNodeInput!) {\n  deleteProfileIngredientConstraint(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProfileIngredientCost($input: DeleteNodeInput!) {\n    deleteProfileIngredientCost(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProfileIngredientCost($input: DeleteNodeInput!) {\n    deleteProfileIngredientCost(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteProfileIngredientNutrientValue($input: DeleteNodeInput!) {\n  deleteProfileIngredientNutrientValue(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteProfileIngredientNutrientValue($input: DeleteNodeInput!) {\n  deleteProfileIngredientNutrientValue(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteProfileNutrientConstraint($input: DeleteNodeInput!) {\n  deleteProfileNutrientConstraint(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteProfileNutrientConstraint($input: DeleteNodeInput!) {\n  deleteProfileNutrientConstraint(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteProfileNutrientValueMutation($input: DeleteNodeInput!) {\n  deleteProfileNutrientValue(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteProfileNutrientValueMutation($input: DeleteNodeInput!) {\n  deleteProfileNutrientValue(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteProfile($input: DeleteNodeInput!) {\n  deleteProfile(input: $input) {\n    success\n  }\n}\n"): (typeof documents)["\nmutation DeleteProfile($input: DeleteNodeInput!) {\n  deleteProfile(input: $input) {\n    success\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GenerateDietOutput($input: GenerateDietOutputInput!) {\n    generateDietOutput(input: $input) {\n      id\n      status\n      version\n      ingredientOutputs {\n        id\n        ingredient {\n          name\n        }\n        cost\n        costUnit {\n          symbol\n        }\n        amount\n        amountUnit {\n          symbol\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GenerateDietOutput($input: GenerateDietOutputInput!) {\n    generateDietOutput(input: $input) {\n      id\n      status\n      version\n      ingredientOutputs {\n        id\n        ingredient {\n          name\n        }\n        cost\n        costUnit {\n          symbol\n        }\n        amount\n        amountUnit {\n          symbol\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDietProfiles($input: UpdateDietProfilesInput!) {\n    updateDietProfiles(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDietProfiles($input: UpdateDietProfilesInput!) {\n    updateDietProfiles(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateDiet($input: UpdateDietInput!) {\n    updateDiet(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateDiet($input: UpdateDietInput!) {\n    updateDiet(input: $input) {\n      id\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation UpdateProfileConstraint($input: UpdateProfileConstraintInput!) {\n    updateProfileConstraint(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfileConstraint($input: UpdateProfileConstraintInput!) {\n    updateProfileConstraint(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateProfileIngredientConstraint($input: UpdateProfileIngredientConstraintInput!) {\n  updateProfileIngredientConstraint(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation UpdateProfileIngredientConstraint($input: UpdateProfileIngredientConstraintInput!) {\n  updateProfileIngredientConstraint(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfileIngredientCost(\n    $input: UpdateProfileIngredientCostInput!\n  ) {\n    updateProfileIngredientCost(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfileIngredientCost(\n    $input: UpdateProfileIngredientCostInput!\n  ) {\n    updateProfileIngredientCost(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateProfileIngredientNutrientValue($input: UpdateProfileIngredientNutrientValueInput!) {\n  updateProfileIngredientNutrientValue(input: $input) {\n    id\n  }\n}  \n"): (typeof documents)["\nmutation UpdateProfileIngredientNutrientValue($input: UpdateProfileIngredientNutrientValueInput!) {\n  updateProfileIngredientNutrientValue(input: $input) {\n    id\n  }\n}  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateProfileNutrientConstraint($input: UpdateProfileNutrientConstraintInput!) {\n  updateProfileNutrientConstraint(input: $input) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation UpdateProfileNutrientConstraint($input: UpdateProfileNutrientConstraintInput!) {\n  updateProfileNutrientConstraint(input: $input) {\n    id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateProfileNutrientValue($input: UpdateProfileNutrientValueInput!) {\n  updateProfileNutrientValue(input: $input) {\n    id\n  }\n}  \n"): (typeof documents)["\nmutation UpdateProfileNutrientValue($input: UpdateProfileNutrientValueInput!) {\n  updateProfileNutrientValue(input: $input) {\n    id\n  }\n}  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    description\n  }\n}\n"): (typeof documents)["\nmutation UpdateProfile($input: UpdateProfileInput!) {\n  updateProfile(input: $input) {\n    id\n    name\n    description\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllDiets {\n    diets {\n      edges {\n        node {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllDiets {\n    diets {\n      edges {\n        node {\n          id\n          name\n          description\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetAllIngredientsAndCategories {\n  ingredients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        ingredientCategoryId\n      }\n    }\n  }\n  ingredientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentIngredientCategoryId\n        managed\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetAllIngredientsAndCategories {\n  ingredients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        ingredientCategoryId\n      }\n    }\n  }\n  ingredientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentIngredientCategoryId\n        managed\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetAllNutrientsAndCategories {\n  nutrients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        nutrientCategoryId\n      }\n    }\n  }\n  nutrientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentNutrientCategoryId\n        managed\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetAllNutrientsAndCategories {\n  nutrients {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n        nutrientCategoryId\n      }\n    }\n  }\n  nutrientCategories {\n    edges {\n      node {\n        id\n        name\n        description\n        parentNutrientCategoryId\n        managed\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery GetAllProfiles {\n  profiles {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetAllProfiles {\n  profiles {\n    edges {\n      node {\n        id\n        name\n        description\n        managed\n      }\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllUnits {\n    units {\n      edges {\n        node {\n          id\n          name\n          type\n          symbol\n          baseUnitMultiplier\n          baseUnitOffset\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllUnits {\n    units {\n      edges {\n        node {\n          id\n          name\n          type\n          symbol\n          baseUnitMultiplier\n          baseUnitOffset\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDiet($dietId: GlobalID!) {\n    node(id: $dietId) {\n      ... on Diet {\n        id\n        name\n        description\n        latestConfigurationVersion {\n          profiles {\n            id\n            name\n            description\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDiet($dietId: GlobalID!) {\n    node(id: $dietId) {\n      ... on Diet {\n        id\n        name\n        description\n        latestConfigurationVersion {\n          profiles {\n            id\n            name\n            description\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProfile($profileId: GlobalID!) {\n    node(id: $profileId) {\n      ... on Profile {\n        id\n        name\n        description\n        ingredientConstraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          ingredient {\n            id\n            name\n          }\n          ingredientCategory {\n            id\n            name\n          }\n          literalUnit {\n            id\n            symbol\n          }\n          referenceIngredient {\n            id\n            name\n          }\n          referenceIngredientCategory {\n            id\n            name\n          }\n        }\n        nutrientConstraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          nutrient {\n            id\n            name\n          }\n          nutrientCategory {\n            id\n            name\n          }\n          literalUnit {\n            id\n            symbol\n          }\n          referenceNutrient {\n            id\n            name\n          }\n          referenceNutrientCategory {\n            id\n            name\n          }\n        }\n        ingredientNutrientValues {\n          id\n          value\n          unit {\n            id\n            symbol\n          }\n          ingredient {\n            id\n            name\n          }\n          nutrient {\n            id\n            name\n          }\n        }\n        nutrientValues {\n          id\n          grossEnergy\n          digestibleEnergy\n          metabolizableEnergy\n          netEnergy\n          nutrient {\n            id\n            name\n          }\n          grossEnergyUnit {\n            id\n            symbol\n          }\n          digestibleEnergyUnit {\n            id\n            symbol\n          }\n          metabolizableEnergyUnit {\n            id\n            symbol\n          }\n          netEnergyUnit {\n            id\n            symbol\n          }\n        }\n        ingredientCosts {\n          id\n          mode\n          ingredient {\n            id\n            name\n          }\n          literalCost\n          literalCostUnit {\n            id\n            symbol\n          }\n        }\n        constraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          literalUnit {\n            id\n            symbol\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProfile($profileId: GlobalID!) {\n    node(id: $profileId) {\n      ... on Profile {\n        id\n        name\n        description\n        ingredientConstraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          ingredient {\n            id\n            name\n          }\n          ingredientCategory {\n            id\n            name\n          }\n          literalUnit {\n            id\n            symbol\n          }\n          referenceIngredient {\n            id\n            name\n          }\n          referenceIngredientCategory {\n            id\n            name\n          }\n        }\n        nutrientConstraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          nutrient {\n            id\n            name\n          }\n          nutrientCategory {\n            id\n            name\n          }\n          literalUnit {\n            id\n            symbol\n          }\n          referenceNutrient {\n            id\n            name\n          }\n          referenceNutrientCategory {\n            id\n            name\n          }\n        }\n        ingredientNutrientValues {\n          id\n          value\n          unit {\n            id\n            symbol\n          }\n          ingredient {\n            id\n            name\n          }\n          nutrient {\n            id\n            name\n          }\n        }\n        nutrientValues {\n          id\n          grossEnergy\n          digestibleEnergy\n          metabolizableEnergy\n          netEnergy\n          nutrient {\n            id\n            name\n          }\n          grossEnergyUnit {\n            id\n            symbol\n          }\n          digestibleEnergyUnit {\n            id\n            symbol\n          }\n          metabolizableEnergyUnit {\n            id\n            symbol\n          }\n          netEnergyUnit {\n            id\n            symbol\n          }\n        }\n        ingredientCosts {\n          id\n          mode\n          ingredient {\n            id\n            name\n          }\n          literalCost\n          literalCostUnit {\n            id\n            symbol\n          }\n        }\n        constraints {\n          id\n          type\n          mode\n          operator\n          literalValue\n          literalUnit {\n            id\n            symbol\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;