import {
    AddItemPayloadResolvers,
    AddTagToItemPayloadResolvers,
    AdImageResolvers,
    AdLinkResolvers,
    AdResolvers,
    CreateTagPayloadResolvers,
    ItemResolvers,
    MutationResolvers,
    NameValueResolvers, Node,
    NodeResolvers,
    QueryFindItemsByTagArgs,
    QueryGetItemArgs,
    QueryGetTagArgs,
    QueryNodeArgs,
    QueryResolvers,
    Resolvers, Tag,
    TagResolvers
} from '../generated/resolvers-types';
import {MyContext} from "../index";
import {GraphQLResolveInfo} from "graphql";

const adResolvers: AdResolvers = {
    __resolveType(obj) {
        if ('url' in obj && 'text' in obj) return 'AdLink';
        if ('url' in obj) return 'AdImage';
        return null;
    }
};

const adImageResolvers: AdImageResolvers = {
    id: (parent) => parent.id,
    text: (parent) => parent.text,
    url: (parent) => parent.url
};

const adLinkResolvers: AdLinkResolvers = {
    id: (parent) => parent.id,
    text: (parent) => parent.text,
    url: (parent) => parent.url
};

const addItemPayloadResolvers: AddItemPayloadResolvers = {
    ok: (parent) => parent.ok,
    item: (parent) => parent.item
};

const addTagToItemPayloadResolvers: AddTagToItemPayloadResolvers = {
    ok: (parent) => parent.ok,
    item: (parent) => parent.item
};

const createTagPayloadResolvers: CreateTagPayloadResolvers = {
    ok: (parent) => parent.ok,
    tag: (parent) => parent.tag
};

const itemResolvers: ItemResolvers = {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    value: (parent) => parent.value,
    price: (parent) => parent.price,
    tags: (parent) => parent.tags,
    ads: (parent) => parent.ads,
    categories: (parent) => parent.categories,
};

const mutationResolvers: MutationResolvers = {
    addItem: async (_, {input}, {dataSource}) => {
        const item = dataSource.item.createItem(input.name, input.price);
        return {ok: true, item};
    },
    addTagToItem: async (_, {input}, {dataSource}) => {
        const item = dataSource.item.addTag(input.itemId, input.tagId);
        return {ok: true, item};
    },
    createTag: async (_, {input}, {dataSource}) => {
        const tag = dataSource.tag.createTag(input.name, input.value);
        return {ok: true, tag};
    }
};

const nameValueResolvers: NameValueResolvers = {
    name: (parent) => parent.name,
    value: (parent) => parent.value,
    __resolveType(obj) {
        if (obj.id.startsWith('item:')) return 'Item';
        if (obj.id.startsWith('tag:')) return 'Tag';
        return null;
    }
};

const nodeResolvers: NodeResolvers = {
    id: (parent) => parent.id,
    __resolveType(obj, context, info: GraphQLResolveInfo) {
        if (obj.id.startsWith('item:')) return 'Item';
        if (obj.id.startsWith('tag:')) return 'Tag';
        if (obj.id.startsWith('ad_link:')) return 'AdLink';
        if (obj.id.startsWith('ad_image:')) return 'AdImage';
        return null;
    },
};

const queryResolvers: QueryResolvers = {
    findItemsByTag: async (_: unknown, args: QueryFindItemsByTagArgs, context) => {
        const {dataSource} = context;
        const {name, value} = args;

        return dataSource.item.getItems().filter(item =>
            item.tags.some(tag => tag.name === name && tag.value === value)
        );
    },
    getTag: async (_: unknown, args: QueryGetTagArgs, context) => {
        const {dataSource} = context;

        return dataSource.tag.getTag(args.tagId);
    },
    getItem: async (_: unknown, args: QueryGetItemArgs, context) => {
        const {dataSource} = context;

        return dataSource.item.getItem(args.itemId);
    },
    node: async (_: unknown, args: QueryNodeArgs, context) => {
        const {dataSource} = context;
        switch (args.typename) {
            case 'Item':
                return dataSource.item.getItem(args.id);
            case 'Tag':
                return dataSource.tag.getTag(args.id);
            default:
                return undefined;
        }
    }
}

const tagResolvers: TagResolvers = {
    id: (parent) => parent.id,
    name: (parent) => parent.name,
    value: (parent) => parent.value,
    items: async (parent: Tag, args: unknown, ctx: MyContext, info: unknown) => {
        return ctx.dataSource.item.findItemsByTag(parent.name, parent.value);
    }
};

export function newMyResolvers(): Resolvers {
    return {
        Ad: adResolvers,
        AdImage: adImageResolvers,
        AdLink: adLinkResolvers,
        AddItemPayload: addItemPayloadResolvers,
        AddTagToItemPayload: addTagToItemPayloadResolvers,
        CreateTagPayload: createTagPayloadResolvers,
        Item: itemResolvers,
        Mutation: mutationResolvers,
        NameValue: nameValueResolvers,
        Node: nodeResolvers,
        Query: queryResolvers,
        Tag: tagResolvers,
    };
}

