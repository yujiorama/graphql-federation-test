-- Custom SQL migration file, put your code below! --
insert into
    tag(id, name, value)
values
    ('tag:1', 'Tag 1', 'Value 1'),
    ('tag:2', 'Tag 2', 'Value 2'),
    ('tag:3', 'Tag 3', 'Value 3');
--> statement-breakpoint
insert into
    ad_link(id, url, text)
values
    ('ad:1', 'https://www.google.com', 'Google'),
    ('ad:2', 'https://www.yahoo.com', 'Yahoo'),
    ('ad:3', 'https://www.bing.com', 'Bing');
--> statement-breakpoint
insert into
    ad_image(id, url)
values
    ('ad:1', 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'),
    ('ad:2', 'https://www.yahoo.com/images/yahoo_logo.png'),
    ('ad:3', 'https://www.bing.com/images/bing_logo.png');
--> statement-breakpoint
insert into
    item(id, name, value, price)
values
    ('item:1', 'Item 1', 'Value 1', 100),
    ('item:2', 'Item 2', 'Value 2', 200),
    ('item:3', 'Item 3', 'Value 3', 300);
--> statement-breakpoint
insert into
    item_tags(item_id, tag_id)
values
    ('item:1', 'tag:1'),
    ('item:1', 'tag:2'),
    ('item:2', 'tag:1'),
    ('item:2', 'tag:2'),
    ('item:3', 'tag:3');
--> statement-breakpoint
insert into
    item_ad_links(item_id, ad_link_id)
values
    ('item:1', 'ad:1'),
    ('item:2', 'ad:2'),
    ('item:3', 'ad:3');
--> statement-breakpoint
insert into
    item_ad_images(item_id, ad_image_id)
values
    ('item:1', 'ad:1'),
    ('item:2', 'ad:2'),
    ('item:3', 'ad:3');
--> statement-breakpoint
insert into
    item_categories(item_id, category)
values
    ('item:1', 'SHOES'),
    ('item:2', 'CLOTHES'),
    ('item:3', 'SHOES');
