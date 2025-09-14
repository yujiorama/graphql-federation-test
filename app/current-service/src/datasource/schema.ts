import {integer, sqliteTable, text, unique} from "drizzle-orm/sqlite-core";

/**
 * Represents the "item" database table schema.
 *
 * This table is used to store information about item, including their unique identifier, name,
 * associated value, and price. Each column in the table is defined with specific constraints
 * and types to ensure data integrity.
 *
 * Table definition:
 * - `id`: A unique identifier for each item, defined as the primary key. It is a text-based field.
 * - `name`: The name of the item, which cannot be null.
 * - `value`: The value associated with the item, which cannot be null.
 * - `price`: The price of the item, stored as an integer. This column allows null values.
 */
export const item = sqliteTable("item", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    value: text("value").notNull(),
    price: integer("price"),
});

/**
 * Represents the "tag" table structure in the SQLite database.
 *
 * Fields:
 * - id: The primary key of the table, represented as a non-null text string.
 * - name: A non-null text field representing the name of the tag.
 * - value: A non-null text field representing the value of the tag.
 */
export const tag = sqliteTable("tag", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    value: text("value").notNull(),
});

/**
 * Item.tag を表現
 */
export const itemTags = sqliteTable(
    "item_tag",
    {
        itemId: text("item_id").notNull().references(() => item.id),
        tagId: text("tag_id").notNull().references(() => tag.id),
    },
    (t) => ([
        unique().on(t.itemId, t.tagId)
    ])
);

/**
 * AdLink テーブル
 * - url: 必須
 * - text: 必須（GraphQL の AdLink.text は Non-Null）
 */
export const adLink = sqliteTable("ad_link", {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    text: text("text").notNull(),
});

/**
 * Represents the "item_ad_links" table in the database.
 * This table establishes a relationship between item and advertisement links.
 *
 * Columns:
 * - itemId: A non-nullable text field referencing the "id" column in the "item" table.
 * - adLinkId: A non-nullable text field referencing the "id" column in the "adLink" table.
 *
 * Constraints:
 * - A unique constraint ensures the combination of itemId and adLinkId is unique across the table.
 */
export const itemAdLinks = sqliteTable(
    "item_ad_links",
    {
        itemId: text("item_id").notNull().references(() => item.id),
        adLinkId: text("ad_link_id").notNull().references(() => adLink.id),
    },
    (t) => ([
        unique().on(t.itemId, t.adLinkId)
    ])
);

/**
 * AdImage テーブル
 * - url: 必須
 * - text: 任意（GraphQL の AdImage.text は Nullable）
 */
export const adImage = sqliteTable("ad_image", {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    text: text("text"),
});

/**
 * Represents the SQLite table `item_ad_images`, which maps item to their associated advertisement images.
 *
 * The table consists of the following columns:
 * - `itemId`: A non-nullable text field that serves as a reference to the `id` field in the `item` table.
 * - `adImageId`: A non-nullable text field that serves as a reference to the `id` field in the `adImage` table.
 *
 * Additionally, a unique constraint is applied on the combination of `itemId` and `adImageId` to ensure that
 * no duplicate mappings exist between item and advertisement images.
 */
export const itemAdImages = sqliteTable(
    "item_ad_images",
    {
        itemId: text("item_id").notNull().references(() => item.id),
        adImageId: text("ad_image_id").notNull().references(() => adImage.id),
    },
    (t) => ([
        unique().on(t.itemId, t.adImageId)
    ])
);

/**
 * Item.categories を表現
 * - category: 'SHOES' | 'CLOTHES' | 'ACCESSORIES' を想定（DB 上は TEXT）
 */
export const itemCategories = sqliteTable(
    "item_categories",
    {
        itemId: text("item_id").notNull().references(() => item.id),
        category: text("category").notNull(),
    },
    (t) => ([
        unique().on(t.itemId, t.category)
    ])
);
