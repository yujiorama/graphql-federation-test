CREATE TABLE `ad_image` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`text` text
);
--> statement-breakpoint
CREATE TABLE `ad_link` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `item` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`price` integer
);
--> statement-breakpoint
CREATE TABLE `item_ad_images` (
	`item_id` text NOT NULL,
	`ad_image_id` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ad_image_id`) REFERENCES `ad_image`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_ad_images_item_id_ad_image_id_unique` ON `item_ad_images` (`item_id`,`ad_image_id`);--> statement-breakpoint
CREATE TABLE `item_ad_links` (
	`item_id` text NOT NULL,
	`ad_link_id` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ad_link_id`) REFERENCES `ad_link`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_ad_links_item_id_ad_link_id_unique` ON `item_ad_links` (`item_id`,`ad_link_id`);--> statement-breakpoint
CREATE TABLE `item_categories` (
	`item_id` text NOT NULL,
	`category` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_categories_item_id_category_unique` ON `item_categories` (`item_id`,`category`);--> statement-breakpoint
CREATE TABLE `item_tags` (
	`item_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_tags_item_id_tag_id_unique` ON `item_tags` (`item_id`,`tag_id`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL
);
