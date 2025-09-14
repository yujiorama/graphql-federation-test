CREATE TABLE `ad_image` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`url` text NOT NULL,
	`text` text
);
--> statement-breakpoint
CREATE TABLE `ad_link` (
	`id` text PRIMARY KEY NOT NULL,
	`item_id` text NOT NULL,
	`url` text NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `item_categories` (
	`item_id` text NOT NULL,
	`category` text NOT NULL,
	PRIMARY KEY(`item_id`, `category`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`price` integer
);
--> statement-breakpoint
CREATE TABLE `items_tags` (
	`item_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`item_id`, `tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL
);
