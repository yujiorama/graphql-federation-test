import {Item, Tag} from "./generated/resolvers-types";

export class ItemDatasource {
    // noinspection TypeScriptFieldCanBeMadeReadonly
    private items: Item[] = [];

    constructor() {
        this.items = [
            { id: '1', name: 'Item 1', price: 10, tags: [] },
            { id: '2', name: 'Item 2', price: 20, tags: [] },
            { id: '3', name: 'Item 3', price: 30, tags: [] },
        ];
    }

    getItems(): Item[] {
        return this.items;
    }

    addItem(item: Item): Item {
        this.items.push(item);
        return item;
    }

    deleteItem(id: string): boolean {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}

export class TagDatasource {
    // noinspection TypeScriptFieldCanBeMadeReadonly
    private tags: Tag[] = [];

    constructor() {
        this.tags = [
            { id: '1', name: 'Tag 1', value: 'Value 1', item: null },
            { id: '2', name: 'Tag 2', value: 'Value 2', item: null },
            { id: '3', name: 'Tag 3', value: 'Value 3', item: null },
        ];
    }

    getTags(): Tag[] {
        return this.tags;
    }

    addTag(tag: Tag): Tag {
        this.tags.push(tag);
        return tag;
    }

    deleteTag(id: string): boolean {
        const index = this.tags.findIndex(tag => tag.id === id);
        if (index !== -1) {
            this.tags.splice(index, 1);
            return true;
        }
        return false;
    }
}
