import {
    AddItemInput,
    AddTagToItemInput,
    CreateTagInput,
    Item,
    MutationResolvers,
    Tag
} from '../generated/resolvers-types';

export const mutationResolvers : MutationResolvers = {
    addItem: async (_: unknown, args: { input: AddItemInput }, context) => {
        const { dataSources } = context;

        const newestItem = dataSources.itemDataSource.getItems().sort((a, b) => Number(b.id) - Number(a.id));
        const newItem: Item = {
            id: String(Number(newestItem[0].id) + 1),
            name: args.input.name,
            price: args.input.price,
            tags: [],
        };

        dataSources.itemDataSource.addItem(newItem);

        return {
            ok: true,
            item: newItem,
        };
    },
    addTagToItem: async (_: unknown, args: { input: AddTagToItemInput }, context) => {
        const { dataSources } = context;

        const item = dataSources.itemDataSource.getItems().find(item => item.id === args.input.itemId);
        if (!item) {
            throw new Error(`Item with id ${args.input.itemId} not found`);
        }
        const tag = dataSources.tagDataSource.getTags().find(tag => tag.id === args.input.tagId);
        if (!tag) {
            throw new Error(`Tag with id ${args.input.tagId} not found`);
        }

        const newestItem = dataSources.itemDataSource.getItems().sort((a, b) => Number(b.id) - Number(a.id));
        const newItem: Item = {
            id: String(Number(newestItem[0].id) + 1),
            name: item.name,
            price: item.price,
            tags: item.tags.concat([tag]),
        };

        dataSources.itemDataSource.addItem(newItem);
        dataSources.itemDataSource.deleteItem(item.id);

        return {
            ok: true,
            item: newItem,
        };
    },
    createTag: async (_: unknown, args: { input: CreateTagInput }, context) => {
        const { dataSources } = context;

        const newestTag = dataSources.tagDataSource.getTags().sort((a, b) => Number(b.id) - Number(a.id));
        const newTag: Tag = {
            id: String(Number(newestTag[0].id) + 1),
            name: args.input.name,
            value: args.input.value,
            item: null,
        };

        dataSources.tagDataSource.addTag(newTag);

        return {
            ok: true,
            tag: newTag,
        }
    },
};
