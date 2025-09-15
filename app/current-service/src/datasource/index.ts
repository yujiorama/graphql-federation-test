import { Item, Tag } from "../generated/resolvers-types";
import { randomUUID } from "node:crypto";
import type {Database, DatabaseConnection} from './db';

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

function buildItem(db: DatabaseConnection, row: any): Item {
    const tags = db
        .prepare(
            `SELECT t.id, t.name, t.value
             FROM tag t
             JOIN item_tags it ON it.tag_id = t.id
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

function createItemDataSource(db: DatabaseConnection): ItemDataSource {
    return {
        async findItemsByTag(name: string, value: string): Promise<Item[]> {
            const rows = db
                .prepare(
                    `SELECT DISTINCT i.id, i.name, i.value, i.price
                     FROM item i
                     JOIN item_tags it ON it.item_id = i.id
                     JOIN tag t ON t.id = it.tag_id
                     WHERE t.name = ? AND t.value = ?`
                )
                .all(name, value);

            return rows.map((r: any) => buildItem(db, r));
        },

        getItem(itemId: string): Item | undefined {
            const row = db
                .prepare(`SELECT id, name, value, price FROM item WHERE id = ?`)
                .get(itemId);
            if (!row) return undefined;
            return buildItem(db, row);
        },

        getItems(): Item[] {
            const rows = db
                .prepare(`SELECT id, name, value, price FROM item ORDER BY id`)
                .all();
            return rows.map((r: any) => buildItem(db, r));
        },
    };
}

function createTagDataSource(db: DatabaseConnection): TagDataSource {
    return {
        createTag(name: string, value: string): Tag {
            const id = randomUUID();
            db
                .prepare(`INSERT INTO tag (id, name, value) VALUES (?, ?, ?)`)
                .run(id, name, value);
            return {
                id,
                name,
                value,
                item: undefined,
            };
        },

        getTag(tagId: string): Tag | undefined {
            const row = db
                .prepare(`SELECT id, name, value FROM tag WHERE id = ?`)
                .get(tagId);
            if (!row) return undefined;
            return rowToTag(row);
        },

        getTags(): Tag[] {
            const rows = db
                .prepare(`SELECT id, name, value FROM tag ORDER BY id`)
                .all();
            return rows.map(rowToTag);
        },
    };
}

export type MyDataSource = {
    readonly item: ItemDataSource;
    readonly tag: TagDataSource;
};

export function newMyDataSource(db: Database): MyDataSource {
    return {
        item: createItemDataSource(db.db.$client),
        tag: createTagDataSource(db.db.$client),
    };
}
