import { GraphQLResolveInfo } from 'graphql';
import { MyContext } from '../index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Ad = AdImage | AdLink;

export type AdImage = {
  readonly __typename?: 'AdImage';
  readonly text: Maybe<Scalars['String']['output']>;
  readonly url: Scalars['String']['output'];
};

export type AdLink = {
  readonly __typename?: 'AdLink';
  readonly text: Scalars['String']['output'];
  readonly url: Scalars['String']['output'];
};

export type AddItemInput = {
  readonly name: Scalars['String']['input'];
  readonly price: InputMaybe<Scalars['Int']['input']>;
};

export type AddItemPayload = {
  readonly __typename?: 'AddItemPayload';
  readonly item: Maybe<Item>;
  readonly ok: Scalars['Boolean']['output'];
};

export type AddTagToItemInput = {
  readonly itemId: Scalars['ID']['input'];
  readonly tagId: Scalars['ID']['input'];
};

export type AddTagToItemPayload = {
  readonly __typename?: 'AddTagToItemPayload';
  readonly item: Maybe<Item>;
  readonly ok: Scalars['Boolean']['output'];
};

export enum Category {
  Accessories = 'ACCESSORIES',
  Clothes = 'CLOTHES',
  Shoes = 'SHOES'
}

export type CreateTagInput = {
  readonly name: Scalars['String']['input'];
  readonly value: Scalars['String']['input'];
};

export type CreateTagPayload = {
  readonly __typename?: 'CreateTagPayload';
  readonly ok: Scalars['Boolean']['output'];
  readonly tag: Maybe<Tag>;
};

export type Item = NameValue & Node & {
  readonly __typename?: 'Item';
  readonly ads: ReadonlyArray<Ad>;
  readonly categories: ReadonlyArray<Category>;
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly price: Maybe<Scalars['Int']['output']>;
  readonly tags: ReadonlyArray<Tag>;
  readonly value: Scalars['String']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addItem: AddItemPayload;
  readonly addTagToItem: AddTagToItemPayload;
  readonly createTag: CreateTagPayload;
};


export type MutationAddItemArgs = {
  input: AddItemInput;
};


export type MutationAddTagToItemArgs = {
  input: AddTagToItemInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};

export type NameValue = {
  readonly name: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
};

export type Node = {
  readonly id: Scalars['ID']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly findItemsByTag: ReadonlyArray<Item>;
  readonly getItem: Maybe<Item>;
  readonly getTag: Maybe<Tag>;
  readonly node: Maybe<Node>;
};


export type QueryFindItemsByTagArgs = {
  name: InputMaybe<Scalars['String']['input']>;
  value: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetItemArgs = {
  itemId: Scalars['ID']['input'];
};


export type QueryGetTagArgs = {
  tagId: Scalars['ID']['input'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
  typename: Scalars['String']['input'];
};

export type Tag = NameValue & Node & {
  readonly __typename?: 'Tag';
  readonly id: Scalars['ID']['output'];
  readonly items: ReadonlyArray<Item>;
  readonly name: Scalars['String']['output'];
  readonly value: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Ad: ( AdImage ) | ( AdLink );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  NameValue: ( Omit<Item, 'ads' | 'tags'> & { ads: ReadonlyArray<_RefType['Ad']>, tags: ReadonlyArray<_RefType['Tag']> } ) | ( Omit<Tag, 'items'> & { items: ReadonlyArray<_RefType['Item']> } );
  Node: ( Omit<Item, 'ads' | 'tags'> & { ads: ReadonlyArray<_RefType['Ad']>, tags: ReadonlyArray<_RefType['Tag']> } ) | ( Omit<Tag, 'items'> & { items: ReadonlyArray<_RefType['Item']> } );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Ad: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Ad']>;
  AdImage: ResolverTypeWrapper<AdImage>;
  AdLink: ResolverTypeWrapper<AdLink>;
  AddItemInput: AddItemInput;
  AddItemPayload: ResolverTypeWrapper<Omit<AddItemPayload, 'item'> & { item: Maybe<ResolversTypes['Item']> }>;
  AddTagToItemInput: AddTagToItemInput;
  AddTagToItemPayload: ResolverTypeWrapper<Omit<AddTagToItemPayload, 'item'> & { item: Maybe<ResolversTypes['Item']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: Category;
  CreateTagInput: CreateTagInput;
  CreateTagPayload: ResolverTypeWrapper<Omit<CreateTagPayload, 'tag'> & { tag: Maybe<ResolversTypes['Tag']> }>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Item: ResolverTypeWrapper<Omit<Item, 'ads' | 'tags'> & { ads: ReadonlyArray<ResolversTypes['Ad']>, tags: ReadonlyArray<ResolversTypes['Tag']> }>;
  Mutation: ResolverTypeWrapper<{}>;
  NameValue: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['NameValue']>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tag: ResolverTypeWrapper<Omit<Tag, 'items'> & { items: ReadonlyArray<ResolversTypes['Item']> }>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Ad: ResolversUnionTypes<ResolversParentTypes>['Ad'];
  AdImage: AdImage;
  AdLink: AdLink;
  AddItemInput: AddItemInput;
  AddItemPayload: Omit<AddItemPayload, 'item'> & { item: Maybe<ResolversParentTypes['Item']> };
  AddTagToItemInput: AddTagToItemInput;
  AddTagToItemPayload: Omit<AddTagToItemPayload, 'item'> & { item: Maybe<ResolversParentTypes['Item']> };
  Boolean: Scalars['Boolean']['output'];
  CreateTagInput: CreateTagInput;
  CreateTagPayload: Omit<CreateTagPayload, 'tag'> & { tag: Maybe<ResolversParentTypes['Tag']> };
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Item: Omit<Item, 'ads' | 'tags'> & { ads: ReadonlyArray<ResolversParentTypes['Ad']>, tags: ReadonlyArray<ResolversParentTypes['Tag']> };
  Mutation: {};
  NameValue: ResolversInterfaceTypes<ResolversParentTypes>['NameValue'];
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  Query: {};
  String: Scalars['String']['output'];
  Tag: Omit<Tag, 'items'> & { items: ReadonlyArray<ResolversParentTypes['Item']> };
}>;

export type AdResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Ad'] = ResolversParentTypes['Ad']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AdImage' | 'AdLink', ParentType, ContextType>;
}>;

export type AdImageResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['AdImage'] = ResolversParentTypes['AdImage']> = ResolversObject<{
  text: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AdLinkResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['AdLink'] = ResolversParentTypes['AdLink']> = ResolversObject<{
  text: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddItemPayloadResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['AddItemPayload'] = ResolversParentTypes['AddItemPayload']> = ResolversObject<{
  item: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType>;
  ok: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddTagToItemPayloadResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['AddTagToItemPayload'] = ResolversParentTypes['AddTagToItemPayload']> = ResolversObject<{
  item: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType>;
  ok: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateTagPayloadResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['CreateTagPayload'] = ResolversParentTypes['CreateTagPayload']> = ResolversObject<{
  ok: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tag: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ItemResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Item'] = ResolversParentTypes['Item']> = ResolversObject<{
  ads: Resolver<ReadonlyArray<ResolversTypes['Ad']>, ParentType, ContextType>;
  categories: Resolver<ReadonlyArray<ResolversTypes['Category']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tags: Resolver<ReadonlyArray<ResolversTypes['Tag']>, ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addItem: Resolver<ResolversTypes['AddItemPayload'], ParentType, ContextType, RequireFields<MutationAddItemArgs, 'input'>>;
  addTagToItem: Resolver<ResolversTypes['AddTagToItemPayload'], ParentType, ContextType, RequireFields<MutationAddTagToItemArgs, 'input'>>;
  createTag: Resolver<ResolversTypes['CreateTagPayload'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
}>;

export type NameValueResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['NameValue'] = ResolversParentTypes['NameValue']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Item' | 'Tag', ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type NodeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Item' | 'Tag', ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  findItemsByTag: Resolver<ReadonlyArray<ResolversTypes['Item']>, ParentType, ContextType, QueryFindItemsByTagArgs>;
  getItem: Resolver<Maybe<ResolversTypes['Item']>, ParentType, ContextType, RequireFields<QueryGetItemArgs, 'itemId'>>;
  getTag: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryGetTagArgs, 'tagId'>>;
  node: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id' | 'typename'>>;
}>;

export type TagResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items: Resolver<ReadonlyArray<ResolversTypes['Item']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MyContext> = ResolversObject<{
  Ad: AdResolvers<ContextType>;
  AdImage: AdImageResolvers<ContextType>;
  AdLink: AdLinkResolvers<ContextType>;
  AddItemPayload: AddItemPayloadResolvers<ContextType>;
  AddTagToItemPayload: AddTagToItemPayloadResolvers<ContextType>;
  CreateTagPayload: CreateTagPayloadResolvers<ContextType>;
  Item: ItemResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  NameValue: NameValueResolvers<ContextType>;
  Node: NodeResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Tag: TagResolvers<ContextType>;
}>;

