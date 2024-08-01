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
  nutrients?: InputMaybe<Array<IngredientNutrientInput>>;
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
  nutrients: IngredientNutrientConnection;
};


export type IngredientNutrientsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
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

export type IngredientNutrient = Node & {
  __typename?: 'IngredientNutrient';
  /** The Globally Unique ID of this object */
  id: Scalars['GlobalID']['output'];
  ingredientId: Scalars['GlobalID']['output'];
  nutrient: Nutrient;
  nutrientId: Scalars['GlobalID']['output'];
  organizationId: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type IngredientNutrientConnection = {
  __typename?: 'IngredientNutrientConnection';
  /** Contains the nodes in this connection */
  edges: Array<IngredientNutrientEdge>;
  /** Pagination data for this connection */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IngredientNutrientEdge = {
  __typename?: 'IngredientNutrientEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: IngredientNutrient;
};

export type IngredientNutrientInput = {
  nutrientId: Scalars['GlobalID']['input'];
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
  nutrients?: InputMaybe<Array<IngredientNutrientInput>>;
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
