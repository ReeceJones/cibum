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

export enum ConstraintOperator {
  Equal = 'EQUAL',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  NotEqual = 'NOT_EQUAL'
}

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

export type CreateProfileConstraintInput = {
  profileId: Scalars['GlobalID']['input'];
};

export type CreateProfileIngredientConstraintInput = {
  ingredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  ingredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode: IngredientConstraintMode;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['input'];
  referenceIngredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceIngredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type: IngredientConstraintType;
};

export type CreateProfileIngredientNutrientValueInput = {
  ingredientId: Scalars['GlobalID']['input'];
  nutrientId: Scalars['GlobalID']['input'];
  profileId: Scalars['GlobalID']['input'];
  unitId: Scalars['GlobalID']['input'];
  value: Scalars['Float']['input'];
};

export type CreateProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateProfileNutrientConstraintInput = {
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode: NutrientConstraintMode;
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  nutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['input'];
  referenceNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceNutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type: NutrientConstraintType;
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

export enum IngredientConstraintMode {
  Literal = 'LITERAL',
  Reference = 'REFERENCE'
}

export enum IngredientConstraintType {
  Ingredient = 'INGREDIENT',
  IngredientCategory = 'INGREDIENT_CATEGORY'
}

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
  createProfile: Profile;
  createProfileConstraint: ProfileConstraint;
  createProfileIngredientConstraint: ProfileIngredientConstraint;
  createProfileIngredientNutrientValue: ProfileIngredientNutrientValue;
  createProfileNutrientConstraint: ProfileNutrientConstraint;
  deleteIngredient: DeletedNode;
  deleteIngredientCategory: DeletedNode;
  deleteNutrient: DeletedNode;
  deleteNutrientCategory: DeletedNode;
  deleteProfile: DeletedNode;
  deleteProfileConstraint: DeletedNode;
  deleteProfileIngredientConstraint: DeletedNode;
  deleteProfileIngredientNutrientValue: DeletedNode;
  deleteProfileNutrientConstraint: DeletedNode;
  updateIngredient: Ingredient;
  updateIngredientCategory: IngredientCategory;
  updateNutrient: Nutrient;
  updateNutrientCategory: NutrientCategory;
  updateProfile: Profile;
  updateProfileConstraint: ProfileConstraint;
  updateProfileIngredientConstraint: ProfileIngredientConstraint;
  updateProfileIngredientNutrientValue: ProfileIngredientNutrientValue;
  updateProfileNutrientConstraint: ProfileNutrientConstraint;
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


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};


export type MutationCreateProfileConstraintArgs = {
  input: CreateProfileConstraintInput;
};


export type MutationCreateProfileIngredientConstraintArgs = {
  input: CreateProfileIngredientConstraintInput;
};


export type MutationCreateProfileIngredientNutrientValueArgs = {
  input: CreateProfileIngredientNutrientValueInput;
};


export type MutationCreateProfileNutrientConstraintArgs = {
  input: CreateProfileNutrientConstraintInput;
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


export type MutationDeleteProfileArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileConstraintArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileIngredientConstraintArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileIngredientNutrientValueArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileNutrientConstraintArgs = {
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


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProfileConstraintArgs = {
  input: UpdateProfileConstraintInput;
};


export type MutationUpdateProfileIngredientConstraintArgs = {
  input: UpdateProfileIngredientConstraintInput;
};


export type MutationUpdateProfileIngredientNutrientValueArgs = {
  input: UpdateProfileIngredientNutrientValueInput;
};


export type MutationUpdateProfileNutrientConstraintArgs = {
  input: UpdateProfileNutrientConstraintInput;
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

export enum NutrientConstraintMode {
  Literal = 'LITERAL',
  Reference = 'REFERENCE'
}

export enum NutrientConstraintType {
  Nutrient = 'NUTRIENT',
  NutrientCategory = 'NUTRIENT_CATEGORY'
}

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

export type Profile = Node & {
  __typename?: 'Profile';
  description?: Maybe<Scalars['String']['output']>;
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredientConstraints: Array<ProfileIngredientConstraint>;
  ingredientNutrientValues: Array<ProfileIngredientNutrientValue>;
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nutrientConstraints: Array<ProfileNutrientConstraint>;
  organizationId?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type ProfileConnection = {
  __typename?: 'ProfileConnection';
  /** Contains the nodes in this connection */
  edges: Array<ProfileEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export type ProfileConstraint = Node & {
  __typename?: 'ProfileConstraint';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  profileId: Scalars['GlobalID']['output'];
};

/** An edge in a connection. */
export type ProfileEdge = {
  __typename?: 'ProfileEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Profile;
};

export type ProfileIngredientConstraint = Node & {
  __typename?: 'ProfileIngredientConstraint';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredient?: Maybe<Ingredient>;
  ingredientCategory?: Maybe<IngredientCategory>;
  ingredientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  ingredientId?: Maybe<Scalars['GlobalID']['output']>;
  literalUnit?: Maybe<Unit>;
  literalUnitId?: Maybe<Scalars['GlobalID']['output']>;
  literalValue?: Maybe<Scalars['Float']['output']>;
  mode: IngredientConstraintMode;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['output'];
  referenceIngredient?: Maybe<Ingredient>;
  referenceIngredientCategory?: Maybe<IngredientCategory>;
  referenceIngredientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  referenceIngredientId?: Maybe<Scalars['GlobalID']['output']>;
  type: IngredientConstraintType;
};

export type ProfileIngredientNutrientValue = Node & {
  __typename?: 'ProfileIngredientNutrientValue';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredient: Ingredient;
  ingredientId: Scalars['GlobalID']['output'];
  nutrient: Nutrient;
  nutrientId: Scalars['GlobalID']['output'];
  profileId: Scalars['GlobalID']['output'];
  unit: Unit;
  unitId: Scalars['GlobalID']['output'];
  value: Scalars['Float']['output'];
};

export type ProfileNutrientConstraint = Node & {
  __typename?: 'ProfileNutrientConstraint';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  literalUnit?: Maybe<Unit>;
  literalUnitId?: Maybe<Scalars['GlobalID']['output']>;
  literalValue?: Maybe<Scalars['Float']['output']>;
  mode: NutrientConstraintMode;
  nutrient?: Maybe<Nutrient>;
  nutrientCategory?: Maybe<NutrientCategory>;
  nutrientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  nutrientId?: Maybe<Scalars['GlobalID']['output']>;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['output'];
  referenceNutrient?: Maybe<Nutrient>;
  referenceNutrientCategory?: Maybe<NutrientCategory>;
  referenceNutrientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  referenceNutrientId?: Maybe<Scalars['GlobalID']['output']>;
  type: NutrientConstraintType;
};

export type Query = {
  __typename?: 'Query';
  ingredientCategories: IngredientCategoryConnection;
  ingredients: IngredientConnection;
  node: Node;
  nutrientCategories: NutrientCategoryConnection;
  nutrients: NutrientConnection;
  profiles: ProfileConnection;
  units: UnitConnection;
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


export type QueryProfilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUnitsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Unit = Node & {
  __typename?: 'Unit';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  kilogramMultiplier: Scalars['Float']['output'];
  kilogramOffset: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type UnitConnection = {
  __typename?: 'UnitConnection';
  /** Contains the nodes in this connection */
  edges: Array<UnitEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type UnitEdge = {
  __typename?: 'UnitEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Unit;
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

export type UpdateProfileConstraintInput = {
  id: Scalars['GlobalID']['input'];
};

export type UpdateProfileIngredientConstraintInput = {
  id: Scalars['GlobalID']['input'];
  ingredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  ingredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode?: InputMaybe<IngredientConstraintMode>;
  operator?: InputMaybe<ConstraintOperator>;
  referenceIngredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceIngredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type?: InputMaybe<IngredientConstraintType>;
};

export type UpdateProfileIngredientNutrientValueInput = {
  id: Scalars['GlobalID']['input'];
  ingredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  nutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  unitId?: InputMaybe<Scalars['GlobalID']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['GlobalID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileNutrientConstraintInput = {
  id: Scalars['GlobalID']['input'];
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode?: InputMaybe<NutrientConstraintMode>;
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  nutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  operator?: InputMaybe<ConstraintOperator>;
  referenceNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceNutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type?: InputMaybe<NutrientConstraintType>;
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

export type CreateProfileIngredientConstraintMutationVariables = Exact<{
  input: CreateProfileIngredientConstraintInput;
}>;


export type CreateProfileIngredientConstraintMutation = { __typename?: 'Mutation', createProfileIngredientConstraint: { __typename?: 'ProfileIngredientConstraint', id: any } };

export type CreateProfileIngredientNutrientValueMutationVariables = Exact<{
  input: CreateProfileIngredientNutrientValueInput;
}>;


export type CreateProfileIngredientNutrientValueMutation = { __typename?: 'Mutation', createProfileIngredientNutrientValue: { __typename?: 'ProfileIngredientNutrientValue', id: any } };

export type CreateProfileNutrientConstraintMutationVariables = Exact<{
  input: CreateProfileNutrientConstraintInput;
}>;


export type CreateProfileNutrientConstraintMutation = { __typename?: 'Mutation', createProfileNutrientConstraint: { __typename?: 'ProfileNutrientConstraint', id: any } };

export type CreateProfileMutationVariables = Exact<{
  input: CreateProfileInput;
}>;


export type CreateProfileMutation = { __typename?: 'Mutation', createProfile: { __typename?: 'Profile', id: any } };

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

export type DeleteProfileIngredientConstraintMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteProfileIngredientConstraintMutation = { __typename?: 'Mutation', deleteProfileIngredientConstraint: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteProfileIngredientNutrientValueMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteProfileIngredientNutrientValueMutation = { __typename?: 'Mutation', deleteProfileIngredientNutrientValue: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteProfileNutrientConstraintMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteProfileNutrientConstraintMutation = { __typename?: 'Mutation', deleteProfileNutrientConstraint: { __typename?: 'DeletedNode', success: boolean } };

export type DeleteProfileMutationVariables = Exact<{
  input: DeleteNodeInput;
}>;


export type DeleteProfileMutation = { __typename?: 'Mutation', deleteProfile: { __typename?: 'DeletedNode', success: boolean } };

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

export type UpdateProfileIngredientConstraintMutationVariables = Exact<{
  input: UpdateProfileIngredientConstraintInput;
}>;


export type UpdateProfileIngredientConstraintMutation = { __typename?: 'Mutation', updateProfileIngredientConstraint: { __typename?: 'ProfileIngredientConstraint', id: any } };

export type UpdateProfileIngredientNutrientValueMutationVariables = Exact<{
  input: UpdateProfileIngredientNutrientValueInput;
}>;


export type UpdateProfileIngredientNutrientValueMutation = { __typename?: 'Mutation', updateProfileIngredientNutrientValue: { __typename?: 'ProfileIngredientNutrientValue', id: any } };

export type UpdateProfileNutrientConstraintMutationVariables = Exact<{
  input: UpdateProfileNutrientConstraintInput;
}>;


export type UpdateProfileNutrientConstraintMutation = { __typename?: 'Mutation', updateProfileNutrientConstraint: { __typename?: 'ProfileNutrientConstraint', id: any } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: any, name: string, description?: string | null } };

export type GetAllIngredientsAndCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllIngredientsAndCategoriesQuery = { __typename?: 'Query', ingredients: { __typename?: 'IngredientConnection', edges: Array<{ __typename?: 'IngredientEdge', node: { __typename?: 'Ingredient', id: any, name: string, description?: string | null, managed: boolean, ingredientCategoryId?: any | null } }> }, ingredientCategories: { __typename?: 'IngredientCategoryConnection', edges: Array<{ __typename?: 'IngredientCategoryEdge', node: { __typename?: 'IngredientCategory', id: any, name: string, description?: string | null, parentIngredientCategoryId?: any | null, managed: boolean } }> } };

export type GetAllNutrientsAndCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllNutrientsAndCategoriesQuery = { __typename?: 'Query', nutrients: { __typename?: 'NutrientConnection', edges: Array<{ __typename?: 'NutrientEdge', node: { __typename?: 'Nutrient', id: any, name: string, description?: string | null, managed: boolean, nutrientCategoryId?: any | null } }> }, nutrientCategories: { __typename?: 'NutrientCategoryConnection', edges: Array<{ __typename?: 'NutrientCategoryEdge', node: { __typename?: 'NutrientCategory', id: any, name: string, description?: string | null, parentNutrientCategoryId?: any | null, managed: boolean } }> } };

export type GetAllProfilesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProfilesQuery = { __typename?: 'Query', profiles: { __typename?: 'ProfileConnection', edges: Array<{ __typename?: 'ProfileEdge', node: { __typename?: 'Profile', id: any, name: string, description?: string | null, managed: boolean } }> } };

export type GetAllUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUnitsQuery = { __typename?: 'Query', units: { __typename?: 'UnitConnection', edges: Array<{ __typename?: 'UnitEdge', node: { __typename?: 'Unit', id: any, name: string, symbol: string, kilogramMultiplier: number, kilogramOffset: number } }> } };

export type GetProfileQueryVariables = Exact<{
  profileId: Scalars['GlobalID']['input'];
}>;


export type GetProfileQuery = { __typename?: 'Query', node: { __typename?: 'Ingredient' } | { __typename?: 'IngredientCategory' } | { __typename?: 'Nutrient' } | { __typename?: 'NutrientCategory' } | { __typename?: 'Profile', id: any, name: string, description?: string | null, ingredientConstraints: Array<{ __typename?: 'ProfileIngredientConstraint', id: any, type: IngredientConstraintType, mode: IngredientConstraintMode, operator: ConstraintOperator, literalValue?: number | null, ingredient?: { __typename?: 'Ingredient', id: any, name: string } | null, ingredientCategory?: { __typename?: 'IngredientCategory', id: any, name: string } | null, literalUnit?: { __typename?: 'Unit', id: any, symbol: string } | null, referenceIngredient?: { __typename?: 'Ingredient', id: any, name: string } | null, referenceIngredientCategory?: { __typename?: 'IngredientCategory', id: any, name: string } | null }>, nutrientConstraints: Array<{ __typename?: 'ProfileNutrientConstraint', id: any, type: NutrientConstraintType, mode: NutrientConstraintMode, operator: ConstraintOperator, literalValue?: number | null, nutrient?: { __typename?: 'Nutrient', id: any, name: string } | null, nutrientCategory?: { __typename?: 'NutrientCategory', id: any, name: string } | null, literalUnit?: { __typename?: 'Unit', id: any, symbol: string } | null, referenceNutrient?: { __typename?: 'Nutrient', id: any, name: string } | null, referenceNutrientCategory?: { __typename?: 'NutrientCategory', id: any, name: string } | null }>, ingredientNutrientValues: Array<{ __typename?: 'ProfileIngredientNutrientValue', id: any, value: number, unit: { __typename?: 'Unit', id: any, symbol: string }, ingredient: { __typename?: 'Ingredient', id: any, name: string }, nutrient: { __typename?: 'Nutrient', id: any, name: string } }> } | { __typename?: 'ProfileConstraint' } | { __typename?: 'ProfileIngredientConstraint' } | { __typename?: 'ProfileIngredientNutrientValue' } | { __typename?: 'ProfileNutrientConstraint' } | { __typename?: 'Unit' } };


export const CreateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIngredientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateIngredientCategoryMutation, CreateIngredientCategoryMutationVariables>;
export const CreateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateIngredientMutation, CreateIngredientMutationVariables>;
export const CreateNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNutrientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNutrientCategoryMutation, CreateNutrientCategoryMutationVariables>;
export const CreateNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNutrientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNutrientMutation, CreateNutrientMutationVariables>;
export const CreateProfileIngredientConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProfileIngredientConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProfileIngredientConstraintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProfileIngredientConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProfileIngredientConstraintMutation, CreateProfileIngredientConstraintMutationVariables>;
export const CreateProfileIngredientNutrientValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProfileIngredientNutrientValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProfileIngredientNutrientValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProfileIngredientNutrientValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProfileIngredientNutrientValueMutation, CreateProfileIngredientNutrientValueMutationVariables>;
export const CreateProfileNutrientConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProfileNutrientConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProfileNutrientConstraintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProfileNutrientConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProfileNutrientConstraintMutation, CreateProfileNutrientConstraintMutationVariables>;
export const CreateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProfileMutation, CreateProfileMutationVariables>;
export const DeleteIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIngredientCategoryMutation, DeleteIngredientCategoryMutationVariables>;
export const DeleteIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIngredientMutation, DeleteIngredientMutationVariables>;
export const DeleteNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNutrientCategoryMutation, DeleteNutrientCategoryMutationVariables>;
export const DeleteNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteNutrientMutation, DeleteNutrientMutationVariables>;
export const DeleteProfileIngredientConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProfileIngredientConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProfileIngredientConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteProfileIngredientConstraintMutation, DeleteProfileIngredientConstraintMutationVariables>;
export const DeleteProfileIngredientNutrientValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProfileIngredientNutrientValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProfileIngredientNutrientValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteProfileIngredientNutrientValueMutation, DeleteProfileIngredientNutrientValueMutationVariables>;
export const DeleteProfileNutrientConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProfileNutrientConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProfileNutrientConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteProfileNutrientConstraintMutation, DeleteProfileNutrientConstraintMutationVariables>;
export const DeleteProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteNodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteProfileMutation, DeleteProfileMutationVariables>;
export const UpdateIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIngredientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIngredientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIngredientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateIngredientCategoryMutation, UpdateIngredientCategoryMutationVariables>;
export const UpdateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateIngredientMutation, UpdateIngredientMutationVariables>;
export const UpdateNutrientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrientCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrientCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientCategoryMutation, UpdateNutrientCategoryMutationVariables>;
export const UpdateNutrientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNutrient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNutrientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNutrient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateNutrientMutation, UpdateNutrientMutationVariables>;
export const UpdateProfileIngredientConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfileIngredientConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileIngredientConstraintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfileIngredientConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileIngredientConstraintMutation, UpdateProfileIngredientConstraintMutationVariables>;
export const UpdateProfileIngredientNutrientValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfileIngredientNutrientValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileIngredientNutrientValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfileIngredientNutrientValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileIngredientNutrientValueMutation, UpdateProfileIngredientNutrientValueMutationVariables>;
export const UpdateProfileNutrientConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfileNutrientConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileNutrientConstraintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfileNutrientConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileNutrientConstraintMutation, UpdateProfileNutrientConstraintMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetAllIngredientsAndCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllIngredientsAndCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategoryId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentIngredientCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllIngredientsAndCategoriesQuery, GetAllIngredientsAndCategoriesQueryVariables>;
export const GetAllNutrientsAndCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllNutrientsAndCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategoryId"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentNutrientCategoryId"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllNutrientsAndCategoriesQuery, GetAllNutrientsAndCategoriesQueryVariables>;
export const GetAllProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllProfiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllProfilesQuery, GetAllProfilesQueryVariables>;
export const GetAllUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"kilogramMultiplier"}},{"kind":"Field","name":{"kind":"Name","value":"kilogramOffset"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllUnitsQuery, GetAllUnitsQueryVariables>;
export const GetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Profile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientConstraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"operator"}},{"kind":"Field","name":{"kind":"Name","value":"literalValue"}},{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"literalUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referenceIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referenceIngredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrientConstraints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"operator"}},{"kind":"Field","name":{"kind":"Name","value":"literalValue"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"literalUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referenceNutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"referenceNutrientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientNutrientValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProfileQuery, GetProfileQueryVariables>;
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

export enum ConstraintOperator {
  Equal = 'EQUAL',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  NotEqual = 'NOT_EQUAL'
}

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

export type CreateProfileConstraintInput = {
  profileId: Scalars['GlobalID']['input'];
};

export type CreateProfileIngredientConstraintInput = {
  ingredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  ingredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode: IngredientConstraintMode;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['input'];
  referenceIngredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceIngredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type: IngredientConstraintType;
};

export type CreateProfileIngredientNutrientValueInput = {
  ingredientId: Scalars['GlobalID']['input'];
  nutrientId: Scalars['GlobalID']['input'];
  profileId: Scalars['GlobalID']['input'];
  unitId: Scalars['GlobalID']['input'];
  value: Scalars['Float']['input'];
};

export type CreateProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateProfileNutrientConstraintInput = {
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode: NutrientConstraintMode;
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  nutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['input'];
  referenceNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceNutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type: NutrientConstraintType;
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

export enum IngredientConstraintMode {
  Literal = 'LITERAL',
  Reference = 'REFERENCE'
}

export enum IngredientConstraintType {
  Ingredient = 'INGREDIENT',
  IngredientCategory = 'INGREDIENT_CATEGORY'
}

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
  createProfile: Profile;
  createProfileConstraint: ProfileConstraint;
  createProfileIngredientConstraint: ProfileIngredientConstraint;
  createProfileIngredientNutrientValue: ProfileIngredientNutrientValue;
  createProfileNutrientConstraint: ProfileNutrientConstraint;
  deleteIngredient: DeletedNode;
  deleteIngredientCategory: DeletedNode;
  deleteNutrient: DeletedNode;
  deleteNutrientCategory: DeletedNode;
  deleteProfile: DeletedNode;
  deleteProfileConstraint: DeletedNode;
  deleteProfileIngredientConstraint: DeletedNode;
  deleteProfileIngredientNutrientValue: DeletedNode;
  deleteProfileNutrientConstraint: DeletedNode;
  updateIngredient: Ingredient;
  updateIngredientCategory: IngredientCategory;
  updateNutrient: Nutrient;
  updateNutrientCategory: NutrientCategory;
  updateProfile: Profile;
  updateProfileConstraint: ProfileConstraint;
  updateProfileIngredientConstraint: ProfileIngredientConstraint;
  updateProfileIngredientNutrientValue: ProfileIngredientNutrientValue;
  updateProfileNutrientConstraint: ProfileNutrientConstraint;
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


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};


export type MutationCreateProfileConstraintArgs = {
  input: CreateProfileConstraintInput;
};


export type MutationCreateProfileIngredientConstraintArgs = {
  input: CreateProfileIngredientConstraintInput;
};


export type MutationCreateProfileIngredientNutrientValueArgs = {
  input: CreateProfileIngredientNutrientValueInput;
};


export type MutationCreateProfileNutrientConstraintArgs = {
  input: CreateProfileNutrientConstraintInput;
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


export type MutationDeleteProfileArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileConstraintArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileIngredientConstraintArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileIngredientNutrientValueArgs = {
  input: DeleteNodeInput;
};


export type MutationDeleteProfileNutrientConstraintArgs = {
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


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProfileConstraintArgs = {
  input: UpdateProfileConstraintInput;
};


export type MutationUpdateProfileIngredientConstraintArgs = {
  input: UpdateProfileIngredientConstraintInput;
};


export type MutationUpdateProfileIngredientNutrientValueArgs = {
  input: UpdateProfileIngredientNutrientValueInput;
};


export type MutationUpdateProfileNutrientConstraintArgs = {
  input: UpdateProfileNutrientConstraintInput;
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

export enum NutrientConstraintMode {
  Literal = 'LITERAL',
  Reference = 'REFERENCE'
}

export enum NutrientConstraintType {
  Nutrient = 'NUTRIENT',
  NutrientCategory = 'NUTRIENT_CATEGORY'
}

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

export type Profile = Node & {
  __typename?: 'Profile';
  description?: Maybe<Scalars['String']['output']>;
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredientConstraints: Array<ProfileIngredientConstraint>;
  ingredientNutrientValues: Array<ProfileIngredientNutrientValue>;
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nutrientConstraints: Array<ProfileNutrientConstraint>;
  organizationId?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type ProfileConnection = {
  __typename?: 'ProfileConnection';
  /** Contains the nodes in this connection */
  edges: Array<ProfileEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

export type ProfileConstraint = Node & {
  __typename?: 'ProfileConstraint';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  profileId: Scalars['GlobalID']['output'];
};

/** An edge in a connection. */
export type ProfileEdge = {
  __typename?: 'ProfileEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Profile;
};

export type ProfileIngredientConstraint = Node & {
  __typename?: 'ProfileIngredientConstraint';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredient?: Maybe<Ingredient>;
  ingredientCategory?: Maybe<IngredientCategory>;
  ingredientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  ingredientId?: Maybe<Scalars['GlobalID']['output']>;
  literalUnit?: Maybe<Unit>;
  literalUnitId?: Maybe<Scalars['GlobalID']['output']>;
  literalValue?: Maybe<Scalars['Float']['output']>;
  mode: IngredientConstraintMode;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['output'];
  referenceIngredient?: Maybe<Ingredient>;
  referenceIngredientCategory?: Maybe<IngredientCategory>;
  referenceIngredientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  referenceIngredientId?: Maybe<Scalars['GlobalID']['output']>;
  type: IngredientConstraintType;
};

export type ProfileIngredientNutrientValue = Node & {
  __typename?: 'ProfileIngredientNutrientValue';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredient: Ingredient;
  ingredientId: Scalars['GlobalID']['output'];
  nutrient: Nutrient;
  nutrientId: Scalars['GlobalID']['output'];
  profileId: Scalars['GlobalID']['output'];
  unit: Unit;
  unitId: Scalars['GlobalID']['output'];
  value: Scalars['Float']['output'];
};

export type ProfileNutrientConstraint = Node & {
  __typename?: 'ProfileNutrientConstraint';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  literalUnit?: Maybe<Unit>;
  literalUnitId?: Maybe<Scalars['GlobalID']['output']>;
  literalValue?: Maybe<Scalars['Float']['output']>;
  mode: NutrientConstraintMode;
  nutrient?: Maybe<Nutrient>;
  nutrientCategory?: Maybe<NutrientCategory>;
  nutrientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  nutrientId?: Maybe<Scalars['GlobalID']['output']>;
  operator: ConstraintOperator;
  profileId: Scalars['GlobalID']['output'];
  referenceNutrient?: Maybe<Nutrient>;
  referenceNutrientCategory?: Maybe<NutrientCategory>;
  referenceNutrientCategoryId?: Maybe<Scalars['GlobalID']['output']>;
  referenceNutrientId?: Maybe<Scalars['GlobalID']['output']>;
  type: NutrientConstraintType;
};

export type Query = {
  __typename?: 'Query';
  ingredientCategories: IngredientCategoryConnection;
  ingredients: IngredientConnection;
  node: Node;
  nutrientCategories: NutrientCategoryConnection;
  nutrients: NutrientConnection;
  profiles: ProfileConnection;
  units: UnitConnection;
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


export type QueryProfilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUnitsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Unit = Node & {
  __typename?: 'Unit';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  kilogramMultiplier: Scalars['Float']['output'];
  kilogramOffset: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type UnitConnection = {
  __typename?: 'UnitConnection';
  /** Contains the nodes in this connection */
  edges: Array<UnitEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type UnitEdge = {
  __typename?: 'UnitEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Unit;
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

export type UpdateProfileConstraintInput = {
  id: Scalars['GlobalID']['input'];
};

export type UpdateProfileIngredientConstraintInput = {
  id: Scalars['GlobalID']['input'];
  ingredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  ingredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode?: InputMaybe<IngredientConstraintMode>;
  operator?: InputMaybe<ConstraintOperator>;
  referenceIngredientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceIngredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type?: InputMaybe<IngredientConstraintType>;
};

export type UpdateProfileIngredientNutrientValueInput = {
  id: Scalars['GlobalID']['input'];
  ingredientId?: InputMaybe<Scalars['GlobalID']['input']>;
  nutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  unitId?: InputMaybe<Scalars['GlobalID']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateProfileInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['GlobalID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProfileNutrientConstraintInput = {
  id: Scalars['GlobalID']['input'];
  literalUnitId?: InputMaybe<Scalars['GlobalID']['input']>;
  literalValue?: InputMaybe<Scalars['Float']['input']>;
  mode?: InputMaybe<NutrientConstraintMode>;
  nutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  nutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  operator?: InputMaybe<ConstraintOperator>;
  referenceNutrientCategoryId?: InputMaybe<Scalars['GlobalID']['input']>;
  referenceNutrientId?: InputMaybe<Scalars['GlobalID']['input']>;
  type?: InputMaybe<NutrientConstraintType>;
};
