import {Item, Tag} from '../generated/resolvers-types';

export interface ItemDataSource {
    findItemsByTag: (name: string, value: string) => Promise<Item[]>;
    getItem: (itemId: string) => Item;
    getItems: () => Item[];
}

export const newItemDataSource: ItemDataSource = {
    findItemsByTag(name: string, value: string): Promise<Item[]> {
        return Promise.resolve([]);
    }, getItem(itemId: string): Item {
        return undefined;
    }, getItems(): Item[] {
        return [];
    }
}

export interface TagDataSource {
    createTag: (name: string, value: string) => Tag;
    getTag: (tagId: string) => Tag;
    getTags: () => Tag[];
}

export const newTagDataSource: TagDataSource = {
    createTag(name: string, value: string): Tag {
        return undefined;
    }, getTag(tagId: string): Tag {
        return undefined;
    }, getTags(): Tag[] {
        return [];
    }
}

export type MyDataSource = {
    readonly item: ItemDataSource;
    readonly tag: TagDataSource;
}

export function newMyDataSource(): MyDataSource {
    return {
        item: newItemDataSource,
        tag: newTagDataSource
    };
}
