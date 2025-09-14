-- tables
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  price INTEGER
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS items_tags (
  item_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (item_id, tag_id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ad_link (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  url TEXT NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ad_image (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  url TEXT NOT NULL,
  text TEXT,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item_categories (
  item_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SHOES','CLOTHES','ACCESSORIES')),
  PRIMARY KEY (item_id, category),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- seed data
INSERT OR IGNORE INTO items (id, name, value, price) VALUES
  ('item-1', 'Apple', 'Apple', 120),
  ('item-2', 'Banana', 'Banana', 80),
  ('item-3', 'Orange', 'Orange', 100);

INSERT OR IGNORE INTO tags (id, name, value) VALUES
  ('tag-1', 'color', 'red'),
  ('tag-2', 'color', 'yellow'),
  ('tag-3', 'season', 'winter');

INSERT OR IGNORE INTO items_tags (item_id, tag_id) VALUES
  ('item-1', 'tag-1'),
  ('item-2', 'tag-2'),
  ('item-3', 'tag-3');

INSERT OR IGNORE INTO ad_link (id, item_id, url, text) VALUES
  ('ad-1', 'item-1', 'https://example.com/apple', 'Buy Apple');

INSERT OR IGNORE INTO ad_image (id, item_id, url, text) VALUES
  ('ad-2', 'item-2', 'https://example.com/banana.png', NULL);

INSERT OR IGNORE INTO item_categories (item_id, category) VALUES
  ('item-1', 'ACCESSORIES'),
  ('item-2', 'CLOTHES'),
  ('item-3', 'SHOES');
