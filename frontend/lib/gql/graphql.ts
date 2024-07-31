/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  GlobalID: { input: any; output: any; }
};

export type CreateIngredientCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentIngredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
};

export type CreateIngredientInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  ingredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateNutrientCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
};

export type CreateNutrientInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
};

export type DeleteNodeInput = {
  ids: Array<Scalars['GlobalID']['input']>;
};

export type DeletedNode = {
  __typename?: 'DeletedNode';
  success: Scalars['Boolean']['output'];
};

export type Ingredient = Node & {
  __typename?: 'Ingredient';
  description?: Maybe<Scalars['String']['output']>;
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredientCategory?: Maybe<IngredientCategory>;
  ingredientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type IngredientCategory = Node & {
  __typename?: 'IngredientCategory';
  childIngredientCategories: Array<IngredientCategory>;
  description?: Maybe<Scalars['String']['output']>;
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredients: Array<Ingredient>;
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentIngredientCategory?: Maybe<IngredientCategory>;
  parentIngredientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
};

/** A connection to a list of items. */
export type IngredientCategoryConnection = {
  __typename?: 'IngredientCategoryConnection';
  /** Contains the nodes in this connection */
  edges: Array<IngredientCategoryEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IngredientCategoryEdge = {
  __typename?: 'IngredientCategoryEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: IngredientCategory;
};

/** A connection to a list of items. */
export type IngredientConnection = {
  __typename?: 'IngredientConnection';
  /** Contains the nodes in this connection */
  edges: Array<IngredientEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IngredientEdge = {
  __typename?: 'IngredientEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Ingredient;
};

export type Mutation = {
  __typename?: 'Mutation';
  createIngredient: Ingredient;
  createIngredientCategory: IngredientCategory;
  createNutrient: Nutrient;
  createNutrientCategory: NutrientCategory;
  deleteIngredient: DeletedNode;
  deleteIngredientCategory: DeletedNode;
  deleteNutrient: DeletedNode;
  deleteNutrientCategory: DeletedNode;
  updateIngredient: Ingredient;
  updateIngredientCategory: IngredientCategory;
  updateNutrient: Nutrient;
  updateNutrientCategory: NutrientCategory;
};


export type MutationCreateIngredientArgs = {
  input: CreateIngredientInput;
};


export type MutationCreateIngredientCategoryArgs = {
  input: CreateIngredientCategoryInput;
};


export type MutationCreateNutrientArgs = {
  input: CreateNutrientInput;
};


export type MutationCreateNutrientCategoryArgs = {
  input: CreateNutrientCategoryInput;
};


export type MutationDeleteIngredientArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteIngredientCategoryArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteNutrientArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteNutrientCategoryArgs = {
  input: DeleteNodeInput;
};


export type MutationUpdateIngredientArgs = {
  input: UpdateIngredientInput;
};


export type MutationUpdateIngredientCategoryArgs = {
  input: UpdateIngredientCategoryInput;
};


export type MutationUpdateNutrientArgs = {
  input: UpdateNutrientInput;
};


export type MutationUpdateNutrientCategoryArgs = {
  input: UpdateNutrientCategoryInput;
};

/** An object with a Globally Unique ID */
export type Node = {
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
};

export type Nutrient = Node & {
  __typename?: 'Nutrient';
  description?: Maybe<Scalars['String']['output']>;
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nutrientCategory?: Maybe<NutrientCategory>;
  nutrientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
};

export type NutrientCategory = Node & {
  __typename?: 'NutrientCategory';
  childNutrientCategories: Array<NutrientCategory>;
  childNutrients: Array<Nutrient>;
  description?: Maybe<Scalars['String']['output']>;
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentNutrientCategory?: Maybe<NutrientCategory>;
  parentNutrientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
};

/** A connection to a list of items. */
export type NutrientCategoryConnection = {
  __typename?: 'NutrientCategoryConnection';
  /** Contains the nodes in this connection */
  edges: Array<NutrientCategoryEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type NutrientCategoryEdge = {
  __typename?: 'NutrientCategoryEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: NutrientCategory;
};

/** A connection to a list of items. */
export type NutrientConnection = {
  __typename?: 'NutrientConnection';
  /** Contains the nodes in this connection */
  edges: Array<NutrientEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type NutrientEdge = {
  __typename?: 'NutrientEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Nutrient;
};

/** Information to aid in pagination. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  ingredientCategories: IngredientCategoryConnection;
  ingredients: IngredientConnection;
  node: Node;
  nutrientCategories: NutrientCategoryConnection;
  nutrients: NutrientConnection;
};


export type QueryIngredientCategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  required?: Scalars['Boolean']['input'];
};


export type QueryIngredientsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['GlobalID']['input'];
};


export type QueryNutrientCategoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNutrientsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateIngredientCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['GlobalID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parentIngredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
};

export type UpdateIngredientInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['GlobalID']['input'];
  ingredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNutrientCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['GlobalID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parentNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
};

export type UpdateNutrientInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['GlobalID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
};

export type CreateIngredientCategoryMutationVariables = Exact<{
  input: CreateIngredientCategoryInput;
}>;


export type CreateIngredientCategoryMutation = { __typename?: 'Mutation', createIngredientCategory: { __typename?: 'IngredientCategory', id: any } };

export type CreateIngredientMutationVariables = Exact<{
  input: CreateIngredientInput;
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: { __typename?: 'Ingredient', id: any } };

export type CreateNutrientCategoryMutationVariables = Exact<{
  input: CreateNutrientCategoryInput;
}>;


export type CreateNutrientCategoryMutation = { __typename?: 'Mutation', createNutrientCategory: { __typename?: 'NutrientCategory', id: any } };

export type CreateNutrientMutationVariables = Exact<{
  input: CreateNutrientInput;
}>;


export type CreateNutrientMutation = { __typename?: 'Mutation', createNutrient: { __typename?: 'Nutrient', id: any } };

export type DeleteIngredientCategoryMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteIngredientCategoryMutation = { __typename?: 'Mutation', deleteIngredientCategory: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteIngredientMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteIngredientMutation = { __typename?: 'Mutation', deleteIngredient: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteNutrientCategoryMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteNutrientCategoryMutation = { __typename?: 'Mutation', deleteNutrientCategory: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteNutrientMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteNutrientMutation = { __typename?: 'Mutation', deleteNutrient: { __typename?: 'DeletedNode', success: boolean } };

export type UpdateIngredientCategoryMutationVariables = Exact<{
  input: UpdateIngredientCategoryInput;
}>;


export type UpdateIngredientCategoryMutation = { __typename?: 'Mutation', updateIngredientCategory: { __typename?: 'IngredientCategory', id: any } };

export type UpdateIngredientMutationVariables = Exact<{
  input: UpdateIngredientInput;
}>;


export type UpdateIngredientMutation = { __typename?: 'Mutation', updateIngredient: { __typename?: 'Ingredient', id: any } };

export type UpdateNutrientCategoryMutationVariables = Exact<{
  input: UpdateNutrientCategoryInput;
}>;


export type UpdateNutrientCategoryMutation = { __typename?: 'Mutation', updateNutrientCategory: { __typename?: 'NutrientCategory', id: any } };

export type UpdateNutrientMutationVariables = Exact<{
  input: UpdateNutrientInput;
}>;


export type UpdateNutrientMutation = { __typename?: 'Mutation', updateNutrient: { __typename?: 'Nutrient', id: any } };

export type GetAllIngredientsAndCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllIngredientsAndCategoriesQuery = { __typename?: 'Query', ingredients: { __typename?: 'IngredientConnection', edges: Array<{ __typename?: 'IngredientEdge', node: { __typename?: 'Ingredient', id: any, name: string, description?: string | null, managed: boolean, ingredientCategoryId?: any | null } }> }, ingredientCategories: { __typename?: 'IngredientCategoryConnection', edges: Array<{ __typename?: 'IngredientCategoryEdge', node: { __typename?: 'IngredientCategory', id: any, name: string, description?: string | null, parentIngredientCategoryId?: any | null, managed: boolean } }> } };

export type GetAllNutrientsAndCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllNutrientsAndCategoriesQuery = { __typename?: 'Query', nutrients: { __typename?: 'NutrientConnection', edges: Array<{ __typename?: 'NutrientEdge', node: { __typename?: 'Nutrient', id: any, name: string, description?: string | null, managed: boolean, nutrientCategoryId?: any | null } }> }, nutrientCategories: { __typename?: 'NutrientCategoryConnection', edges: Array<{ __typename?: 'NutrientCategoryEdge', node: { __typename?: 'NutrientCategory', id: any, name: string, description?: string | null, parentNutrientCategoryId?: any | null, managed: boolean } }> } };


export const CreateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIngredientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateIngredientCategoryMutation, CreateIngredientCategoryMutationVariables>;
export const CreateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateIngredientMutation, CreateIngredientMutationVariables>;
export const CreateNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNutrientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNutrientCategoryMutation, CreateNutrientCategoryMutationVariables>;
export const CreateNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNutrientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNutrientMutation, CreateNutrientMutationVariables>;
export const DeleteIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIngredientCategoryMutation, DeleteIngredientCategoryMutationVariables>;
export const DeleteIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIngredientMutation, DeleteIngredientMutationVariables>;
export const DeleteNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNutrientCategoryMutation, DeleteNutrientCategoryMutationVariables>;
export const DeleteNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNutrientMutation, DeleteNutrientMutationVariables>;
export const UpdateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIngredientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateIngredientCategoryMutation, UpdateIngredientCategoryMutationVariables>;
export const UpdateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateIngredientMutation, UpdateIngredientMutationVariables>;
export const UpdateNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientCategoryMutation, UpdateNutrientCategoryMutationVariables>;
export const UpdateNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientMutation, UpdateNutrientMutationVariables>;
export const GetAllIngredientsAndCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllIngredientsAndCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategoryId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentIngredientCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllIngredientsAndCategoriesQuery, GetAllIngredientsAndCategoriesQueryVariables>;
export const GetAllNutrientsAndCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllNutrientsAndCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategoryId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentNutrientCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllNutrientsAndCategoriesQuery, GetAllNutrientsAndCategoriesQueryVariables>;