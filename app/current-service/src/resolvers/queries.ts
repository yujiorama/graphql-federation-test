import {
    ItemResolvers,
    QueryFindItemsByTagArgs,
    QueryResolvers,
    TagResolvers
} from '../generated/resolvers-types';

export const queryResolvers: QueryResolvers = {
    findItemsByTag: async (_: unknown, args: QueryFindItemsByTagArgs, context) => {
        const { dataSources } = context;
        const { name, value } = args;

        return dataSources.itemDataSource.getItems().filter(item =>
            item.tags.some(tag => tag.name === name && tag.value === value)
        );
    },
    getTag: (_: unknown, args: { id: string }, context) => {
        const {dataSources} = context;

        return  dataSources.tagDataSource.getTags().find(tag => tag.id === args.id);
    },
    getItem: (_: unknown, args: { id: string }, context) => {
        const {dataSources} = context;

        return dataSources.itemDataSource.getItems().find(item => item.id === args.id);
    },
};

export const tagResolvers : TagResolvers = {
    id: (tag) => tag.id,
    item: (tag, _, context) => {
        const { dataSources } = context;

        return dataSources.itemDataSource.getItems().find(item => item.tags.some(t => t.id === tag.id));
    },
    name: (tag) => tag.name,
    value: (tag) => tag.value,
};

export const itemResolvers : ItemResolvers = {
    id: (item) => item.id,
    name: (item) => item.name,
    price: (item) => item.price,
    tags: (item, _, context) => {
        const { dataSources } = context;

        return dataSources.tagDataSource.getTags().filter(tag => item.tags.some(t => t.id === tag.id));
    },
};
