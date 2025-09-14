import {
    AddItemPayloadResolvers,
    AddTagToItemPayloadResolvers,
    AdImageResolvers,
    AdLinkResolvers,
    AdResolvers,
    CreateTagPayloadResolvers,
    ItemResolvers,
    MutationResolvers,
    NameValueResolvers,
    NodeResolvers,
    QueryFindItemsByTagArgs,
    QueryGetItemArgs,
    QueryGetTagArgs,
    QueryNodeArgs,
    QueryResolvers,
    Resolvers,
    TagResolvers
} from '../generated/resolvers-types';

const adResolvers: AdResolvers = {
    __resolveType(obj) {
        if ('url' in obj && 'text' in obj) return 'AdLink';
        if ('url' in obj) return 'AdImage';
        return null;
    }
};

const adImageResolvers: AdImageResolvers = {
    text: (parent) => parent.text,
    url: (parent) => parent.url
};

const adLinkResolvers: AdLinkResolvers = {
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
        const item = dataSource.item.getItem("temp");
        return {ok: true, item};
    },
    addTagToItem: async (_, {input}, {dataSource}) => {
        const item = dataSource.item.getItem(input.itemId);
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
        if ('price' in obj) return 'Item';
        if ('value' in obj) return 'Tag';
        return null;
    }
};

const nodeResolvers: NodeResolvers = {
    id: (parent) => parent.id,
    __resolveType(obj) {
        if ('price' in obj) return 'Item';
        if ('value' in obj) return 'Tag';
        return null;
    }
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
    item: (parent) => parent.item
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

