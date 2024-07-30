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

export type Mutation = {
  __typename?: 'Mutation';
  createNutrient: Nutrient;
  createNutrientCategory: NutrientCategory;
  deleteNutrient: DeletedNode;
  deleteNutrientCategory: DeletedNode;
  updateNutrient: Nutrient;
  updateNutrientCategory: NutrientCategory;
  updateNutrientSettings: UpdatedNutrientSettings;
};


export type MutationCreateNutrientArgs = {
  input: CreateNutrientInput;
};


export type MutationCreateNutrientCategoryArgs = {
  input: CreateNutrientCategoryInput;
};


export type MutationDeleteNutrientArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteNutrientCategoryArgs = {
  input: DeleteNodeInput;
};


export type MutationUpdateNutrientArgs = {
  input: UpdateNutrientInput;
};


export type MutationUpdateNutrientCategoryArgs = {
  input: UpdateNutrientCategoryInput;
};


export type MutationUpdateNutrientSettingsArgs = {
  input: UpdateNutrientSettingsInput;
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

export type NutrientCategorySettingsInput = {
  childCategories?: InputMaybe<Array<NutrientCategorySettingsInput>>;
  childNutrients?: InputMaybe<Array<NutrientSettingsInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['GlobalID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
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

export type NutrientSettingsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['GlobalID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
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
  node: Node;
  nutrientCategories: NutrientCategoryConnection;
  nutrients: NutrientConnection;
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

export type UpdateNutrientSettingsInput = {
  deleteNutrientCategories?: InputMaybe<DeleteNodeInput>;
  deleteNutrients?: InputMaybe<DeleteNodeInput>;
  updateNutrientCategories?: InputMaybe<Array<NutrientCategorySettingsInput>>;
  updateNutrients?: InputMaybe<Array<NutrientSettingsInput>>;
};

export type UpdatedNutrientSettings = {
  __typename?: 'UpdatedNutrientSettings';
  success: Scalars['Boolean']['output'];
};

export type CreateNutrientCategoryMutationVariables = Exact<{
  input: CreateNutrientCategoryInput;
}>;


export type CreateNutrientCategoryMutation = { __typename?: 'Mutation', createNutrientCategory: { __typename?: 'NutrientCategory', id: any } };

export type CreateNutrientMutationVariables = Exact<{
  input: CreateNutrientInput;
}>;


export type CreateNutrientMutation = { __typename?: 'Mutation', createNutrient: { __typename?: 'Nutrient', id: any } };

export type DeleteNutrientCategoryMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteNutrientCategoryMutation = { __typename?: 'Mutation', deleteNutrientCategory: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteNutrientMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteNutrientMutation = { __typename?: 'Mutation', deleteNutrient: { __typename?: 'DeletedNode', success: boolean } };

export type UpdateNutrientCategoryMutationVariables = Exact<{
  input: UpdateNutrientCategoryInput;
}>;


export type UpdateNutrientCategoryMutation = { __typename?: 'Mutation', updateNutrientCategory: { __typename?: 'NutrientCategory', id: any } };

export type UpdateNutrientMutationVariables = Exact<{
  input: UpdateNutrientInput;
}>;


export type UpdateNutrientMutation = { __typename?: 'Mutation', updateNutrient: { __typename?: 'Nutrient', id: any } };

export type UpdateNutrientSettingsMutationVariables = Exact<{
  input: UpdateNutrientSettingsInput;
}>;


export type UpdateNutrientSettingsMutation = { __typename?: 'Mutation', updateNutrientSettings: { __typename?: 'UpdatedNutrientSettings', success: boolean } };

export type GetAllNutrientsAndCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllNutrientsAndCategoriesQuery = { __typename?: 'Query', nutrients: { __typename?: 'NutrientConnection', edges: Array<{ __typename?: 'NutrientEdge', node: { __typename?: 'Nutrient', id: any, name: string, description?: string | null, managed: boolean, nutrientCategoryId?: any | null } }> }, nutrientCategories: { __typename?: 'NutrientCategoryConnection', edges: Array<{ __typename?: 'NutrientCategoryEdge', node: { __typename?: 'NutrientCategory', id: any, name: string, description?: string | null, parentNutrientCategoryId?: any | null, managed: boolean } }> } };


export const CreateNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNutrientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNutrientCategoryMutation, CreateNutrientCategoryMutationVariables>;
export const CreateNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNutrientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNutrientMutation, CreateNutrientMutationVariables>;
export const DeleteNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNutrientCategoryMutation, DeleteNutrientCategoryMutationVariables>;
export const DeleteNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNutrientMutation, DeleteNutrientMutationVariables>;
export const UpdateNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientCategoryMutation, UpdateNutrientCategoryMutationVariables>;
export const UpdateNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientMutation, UpdateNutrientMutationVariables>;
export const UpdateNutrientSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrientSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrientSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientSettingsMutation, UpdateNutrientSettingsMutationVariables>;
export const GetAllNutrientsAndCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllNutrientsAndCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategoryId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentNutrientCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllNutrientsAndCategoriesQuery, GetAllNutrientsAndCategoriesQueryVariables>;