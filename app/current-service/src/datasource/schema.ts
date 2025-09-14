import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  price: integer("price"),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
});

export const itemsTags = sqliteTable(
  "items_tags",
  {
    itemId: text("item_id").notNull(),
    tagId: text("tag_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.tagId] }),
  })
);

/**
 * AdLink テーブル
 * - url: 必須
 * - text: 必須（GraphQL の AdLink.text は Non-Null）
 */
export const adLink = sqliteTable("ad_link", {
  id: text("id").primaryKey(),
  itemId: text("item_id").notNull(),
  url: text("url").notNull(),
  text: text("text").notNull(),
});

/**
 * AdImage テーブル
 * - url: 必須
 * - text: 任意（GraphQL の AdImage.text は Nullable）
 */
export const adImage = sqliteTable("ad_image", {
  id: text("id").primaryKey(),
  itemId: text("item_id").notNull(),
  url: text("url").notNull(),
  text: text("text"),
});

/**
 * Item.categories を表現
 * - category: 'SHOES' | 'CLOTHES' | 'ACCESSORIES' を想定（DB 上は TEXT）
 */
export const itemCategories = sqliteTable(
  "item_categories",
  {
    itemId: text("item_id").notNull(),
    category: text("category").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.category] }),
  })
);
