import {Item, Tag} from "../generated/resolvers-types";
import type {Database, DatabaseConnection} from './db';

export interface ItemDataSource {
    findItemsByTag: (name: string, value: string) => Promise<Item[]>;
    getItem: (itemId: string) => Item | undefined;
    getItems: () => Item[];
    createItem: (name: string, price: number) => Item;
    addTag: (itemId: string, tagId: string) => Item;
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
        items: undefined // フィールドリゾルバで解決する,
    };
}

function buildItem(db: DatabaseConnection, row: any): Item {
    const tags = db
        .prepare(
            `SELECT
                 t.id,
                 t.name,
                 t.value
             FROM
                 tag t
                 JOIN item_tags it
                      ON it.tag_id = t.id
             WHERE
                 it.item_id = ?`
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
                    `SELECT DISTINCT
                         i.id,
                         i.name,
                         i.value,
                         i.price
                     FROM
                         item i
                         JOIN item_tags it
                              ON it.item_id = i.id
                         JOIN tag t
                              ON t.id = it.tag_id
                     WHERE
                         t.name = ?
                       AND t.value = ?`
                )
                .all(name, value);

            return rows.map((r: any) => buildItem(db, r));
        },

        getItem(itemId: string): Item | undefined {
            const row = db
                .prepare(`SELECT
                              id,
                              name,
                              value,
                              price
                          FROM
                              item
                          WHERE
                              id = ?`)
                .get(itemId);
            if (!row) return undefined;
            return buildItem(db, row);
        },

        getItems(): Item[] {
            const rows = db
                .prepare(`SELECT
                              id,
                              name,
                              value,
                              price
                          FROM
                              item
                          ORDER BY
                              id`)
                .all();
            return rows.map((r: any) => buildItem(db, r));
        },

        createItem(name: string, price: number): Item {
            const items = this.getItems();
            const maxId = items.length > 0 ? items[items.length - 1].id : 0;
            const newItemId = `item:${maxId + 1}`;
            const runResult = db
                .prepare(`INSERT INTO
                              item (id, name, value, price)
                          VALUES
                              (?, ?, ?, ?)`)
                .run(newItemId, name, name, price);

            if (runResult.changes === 0) {
                throw new Error('Failed to create item');
            }

            return {
                id: newItemId,
                name: name,
                value: name,
                price: price,
                tags: [],
                ads: [],
                categories: [],
            };
        },
        addTag(itemId: string, tagId: string): Item {
            const item_tag_relation = db
                .prepare(`SELECT
                              item_id,
                              tag_id
                          FROM
                              item_tags
                          WHERE
                                item_id = ?
                            AND tag_id = ?`)
                .get(itemId, tagId);
            if (item_tag_relation) {
                return this.getItem(itemId)!;
            }
            const runResult = db
                .prepare(`INSERT INTO
                              item_tags (item_id, tag_id)
                          VALUES
                              (?, ?)`)
                .run(itemId, tagId);
            if (runResult.changes === 0) {
                throw new Error('Failed to create item_tag');
            }
            return this.getItem(itemId)!;
        }
    };
}

function createTagDataSource(db: DatabaseConnection): TagDataSource {
    return {
        createTag(name: string, value: string): Tag {
            const tags = this.getTags();
            const maxId = tags.length > 0 ? tags[tags.length - 1].id : 0;
            const newTagId = `tag:${maxId + 1}`;
            const runResult = db
                .prepare(`INSERT INTO
                              tag (id, name, value)
                          VALUES
                              (?, ?, ?)`)
                .run(newTagId, name, value);
            if (runResult.changes === 0) {
                throw new Error('Failed to create tag');
            }
            return {
                id: newTagId,
                name,
                value,
                items: [],
            };
        },

        getTag(tagId: string): Tag | undefined {
            const row = db
                .prepare(`SELECT
                              id,
                              name,
                              value
                          FROM
                              tag
                          WHERE
                              id = ?`)
                .get(tagId);
            if (!row) return undefined;
            return rowToTag(row);
        },

        getTags(): Tag[] {
            const rows = db
                .prepare(`SELECT
                              id,
                              name,
                              value
                          FROM
                              tag
                          ORDER BY
                              id`)
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
