import { Item, Tag } from "../generated/resolvers-types";
import { randomUUID } from "node:crypto";
import { DbSqlite } from "./db";

export interface ItemDataSource {
    findItemsByTag: (name: string, value: string) => Promise<Item[]>;
    getItem: (itemId: string) => Item | undefined;
    getItems: () => Item[];
}

export interface TagDataSource {
    createTag: (name: string, value: string) => Tag;
    getTag: (tagId: string) => Tag | undefined;
    getTags: () => Tag[];
}

function rowToTag(row: any): Tag {
    return {
        id: String(row.id),
        name: String(row.name),
        value: String(row.value),
        item: undefined, // 必要なら関連取得で埋める
    };
}

function buildItem(sqlite: DbSqlite, row: any): Item {
    const tags = sqlite
        .prepare(
            `SELECT t.id, t.name, t.value
             FROM tags t
             JOIN items_tags it ON it.tag_id = t.id
             WHERE it.item_id = ?`
        )
        .all(row.id)
        .map(rowToTag);

    return {
        id: String(row.id),
        name: String(row.name),
        value: String(row.value),
        price: row.price === null || row.price === undefined ? null : Number(row.price),
        tags,
        ads: [], // 検証用のため空配列
        categories: [],
    } as Item;
}

function createItemDataSource(sqlite: DbSqlite): ItemDataSource {
    return {
        async findItemsByTag(name: string, value: string): Promise<Item[]> {
            const rows = sqlite
                .prepare(
                    `SELECT DISTINCT i.id, i.name, i.value, i.price
                     FROM items i
                     JOIN items_tags it ON it.item_id = i.id
                     JOIN tags t ON t.id = it.tag_id
                     WHERE t.name = ? AND t.value = ?`
                )
                .all(name, value);

            return rows.map((r: any) => buildItem(sqlite, r));
        },

        getItem(itemId: string): Item | undefined {
            const row = sqlite
                .prepare(`SELECT id, name, value, price FROM items WHERE id = ?`)
                .get(itemId);
            if (!row) return undefined;
            return buildItem(sqlite, row);
        },

        getItems(): Item[] {
            const rows = sqlite
                .prepare(`SELECT id, name, value, price FROM items ORDER BY id`)
                .all();
            return rows.map((r: any) => buildItem(sqlite, r));
        },
    };
}

function createTagDataSource(sqlite: DbSqlite): TagDataSource {
    return {
        createTag(name: string, value: string): Tag {
            const id = randomUUID();
            sqlite
                .prepare(`INSERT INTO tags (id, name, value) VALUES (?, ?, ?)`)
                .run(id, name, value);
            return {
                id,
                name,
                value,
                item: undefined,
            };
        },

        getTag(tagId: string): Tag | undefined {
            const row = sqlite
                .prepare(`SELECT id, name, value FROM tags WHERE id = ?`)
                .get(tagId);
            if (!row) return undefined;
            return rowToTag(row);
        },

        getTags(): Tag[] {
            const rows = sqlite
                .prepare(`SELECT id, name, value FROM tags ORDER BY id`)
                .all();
            return rows.map(rowToTag);
        },
    };
}

export type MyDataSource = {
    readonly item: ItemDataSource;
    readonly tag: TagDataSource;
};

export function newMyDataSource(sqlite: DbSqlite): MyDataSource {
    return {
        item: createItemDataSource(sqlite),
        tag: createTagDataSource(sqlite),
    };
}
