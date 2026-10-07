-- EmDash 1.1 template defaults. Additive and repeatable; preserves existing editor-managed structures and article bodies.

CREATE TABLE IF NOT EXISTS "ec_pages" ("id" text primary key, "slug" text, "status" text default 'draft', "author_id" text, "primary_byline_id" text, "created_at" text default (datetime('now')), "updated_at" text default (datetime('now')), "published_at" text, "scheduled_at" text, "deleted_at" text, "version" integer default 1, "live_revision_id" text references "revisions" ("id"), "draft_revision_id" text references "revisions" ("id"), "locale" text default 'en' not null, "translation_group" text, "title" text default '' not null, "content" json, "excerpt" text, constraint "ec_pages_slug_locale_unique" unique ("slug", "locale"));

CREATE VIRTUAL TABLE IF NOT EXISTS "_emdash_fts_pages" USING fts5(
				id UNINDEXED, locale UNINDEXED, title, content,
				tokenize='porter unicode61'
			);

CREATE INDEX IF NOT EXISTS "idx_ec_pages_slug"
			ON "ec_pages" (slug)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_del_sched"
			ON "ec_pages" (deleted_at, scheduled_at)
			WHERE scheduled_at IS NOT NULL
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_live_revision"
			ON "ec_pages" (live_revision_id)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_draft_revision"
			ON "ec_pages" (draft_revision_id)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_author"
			ON "ec_pages" (author_id)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_primary_byline"
			ON "ec_pages" (primary_byline_id)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_locale"
			ON "ec_pages" (locale)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_tg_locale"
			ON "ec_pages" (translation_group, locale)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_del_tg_locale"
			ON "ec_pages" (deleted_at, translation_group, locale)
		;

CREATE UNIQUE INDEX IF NOT EXISTS "uidx_ec_pages_active_tg_locale"
			ON "ec_pages" (translation_group, lower(locale))
			WHERE deleted_at IS NULL AND translation_group IS NOT NULL
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_deleted_updated_id"
			ON "ec_pages" (deleted_at, updated_at DESC, id DESC)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_deleted_status"
			ON "ec_pages" (deleted_at, status)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_deleted_created_id"
			ON "ec_pages" (deleted_at, created_at DESC, id DESC)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_deleted_published_id"
			ON "ec_pages" (deleted_at, published_at DESC, id DESC)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_loc_upd"
			ON "ec_pages" (deleted_at, locale, updated_at DESC, id DESC)
		;

CREATE INDEX IF NOT EXISTS "idx_ec_pages_loc_crt"
			ON "ec_pages" (deleted_at, locale, created_at DESC, id DESC)
		;

CREATE TRIGGER IF NOT EXISTS "_emdash_fts_pages_insert"
			AFTER INSERT ON "ec_pages"
			WHEN NEW.deleted_at IS NULL
			BEGIN
				INSERT OR REPLACE INTO "_emdash_fts_pages"(rowid, id, locale, title, content)
				VALUES (NEW.rowid, NEW.id, NEW.locale, NEW.title, CASE WHEN NEW.content IS NULL THEN NULL WHEN json_valid(NEW.content) AND json_type(NEW.content) IN ('array', 'object') THEN (SELECT group_concat(j.value, ' ') FROM json_tree(NEW.content) AS j WHERE j.key IN ('text', 'alt', 'caption', 'code') AND j.type = 'text') ELSE NEW.content END);
			END;

CREATE TRIGGER IF NOT EXISTS "_emdash_fts_pages_update"
			AFTER UPDATE ON "ec_pages"
			WHEN OLD.deleted_at IS NOT NEW.deleted_at OR OLD.locale IS NOT NEW.locale OR OLD.title IS NOT NEW.title OR OLD.content IS NOT NEW.content
			BEGIN
				DELETE FROM "_emdash_fts_pages" WHERE rowid = OLD.rowid;
				INSERT INTO "_emdash_fts_pages"(rowid, id, locale, title, content)
				SELECT NEW.rowid, NEW.id, NEW.locale, NEW.title, CASE WHEN NEW.content IS NULL THEN NULL WHEN json_valid(NEW.content) AND json_type(NEW.content) IN ('array', 'object') THEN (SELECT group_concat(j.value, ' ') FROM json_tree(NEW.content) AS j WHERE j.key IN ('text', 'alt', 'caption', 'code') AND j.type = 'text') ELSE NEW.content END
				WHERE NEW.deleted_at IS NULL;
			END;

CREATE TRIGGER IF NOT EXISTS "_emdash_fts_pages_delete"
			AFTER DELETE ON "ec_pages"
			BEGIN
				DELETE FROM "_emdash_fts_pages" WHERE rowid = OLD.rowid;
			END;

INSERT OR IGNORE INTO _emdash_collections ("id","slug","label","label_singular","description","icon","supports","source","created_at","updated_at","search_config","has_seo","url_pattern","comments_enabled","comments_moderation","comments_closed_after_days","comments_auto_approve_users","hidden","sort_order","admin_config","title_field","date_field","routable","edit_locking","nav_group") SELECT '01M4A6BK9BM2HMWCT46CX3VSFE','pages','頁面','頁面',NULL,NULL,'["drafts","revisions","preview","search","seo"]','seed','2026-10-07 03:26:18','2026-10-07 03:26:18','{"enabled":true}',1,'/pages/{slug}',0,'first_time',90,1,0,NULL,NULL,NULL,NULL,1,1,NULL WHERE NOT EXISTS (SELECT 1 FROM _emdash_collections WHERE "slug"='pages');

INSERT OR IGNORE INTO _emdash_fields ("id","collection_id","slug","label","type","column_type","required","unique","default_value","validation","widget","options","sort_order","created_at","searchable","translatable","indexed") SELECT '01M4A6BK9C3R0Z3YJJ8711K9FX','01M4A6BK9BM2HMWCT46CX3VSFE','title','標題','string','TEXT',1,0,NULL,NULL,NULL,NULL,0,'2026-10-07 03:26:18',1,1,0 WHERE NOT EXISTS (SELECT 1 FROM _emdash_fields WHERE "collection_id"='01M4A6BK9BM2HMWCT46CX3VSFE' AND "slug"='title' OR collection_id IN (SELECT id FROM _emdash_collections WHERE slug='pages' AND id!='01M4A6BK9BM2HMWCT46CX3VSFE'));

INSERT OR IGNORE INTO _emdash_fields ("id","collection_id","slug","label","type","column_type","required","unique","default_value","validation","widget","options","sort_order","created_at","searchable","translatable","indexed") SELECT '01M4A6BK9CBNFH9EWFFTK58Q3G','01M4A6BK9BM2HMWCT46CX3VSFE','content','內容','portableText','JSON',0,0,NULL,NULL,NULL,NULL,1,'2026-10-07 03:26:18',1,1,0 WHERE NOT EXISTS (SELECT 1 FROM _emdash_fields WHERE "collection_id"='01M4A6BK9BM2HMWCT46CX3VSFE' AND "slug"='content' OR collection_id IN (SELECT id FROM _emdash_collections WHERE slug='pages' AND id!='01M4A6BK9BM2HMWCT46CX3VSFE'));

INSERT OR IGNORE INTO _emdash_fields ("id","collection_id","slug","label","type","column_type","required","unique","default_value","validation","widget","options","sort_order","created_at","searchable","translatable","indexed") SELECT '01M4A6BK9CC64XN73W3X7K7AFG','01M4A6BK9BM2HMWCT46CX3VSFE','excerpt','摘要','text','TEXT',0,0,NULL,NULL,NULL,NULL,2,'2026-10-07 03:26:18',0,1,0 WHERE NOT EXISTS (SELECT 1 FROM _emdash_fields WHERE "collection_id"='01M4A6BK9BM2HMWCT46CX3VSFE' AND "slug"='excerpt' OR collection_id IN (SELECT id FROM _emdash_collections WHERE slug='pages' AND id!='01M4A6BK9BM2HMWCT46CX3VSFE'));

INSERT OR IGNORE INTO _emdash_taxonomy_defs ("id","name","label","label_singular","hierarchical","collections","created_at","locale","translation_group") SELECT 'taxdef_category','category','分類','分類',1,'["posts"]','2026-10-07 03:26:18','en','taxdef_category' WHERE NOT EXISTS (SELECT 1 FROM _emdash_taxonomy_defs WHERE "name"='category' AND "locale"='en');

INSERT OR IGNORE INTO _emdash_taxonomy_defs ("id","name","label","label_singular","hierarchical","collections","created_at","locale","translation_group") SELECT 'taxdef_tag','tag','標籤','標籤',0,'["posts"]','2026-10-07 03:26:18','en','taxdef_tag' WHERE NOT EXISTS (SELECT 1 FROM _emdash_taxonomy_defs WHERE "name"='tag' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9H4W2EDMK0MMTB080R','category','產品消息','產品消息',NULL,NULL,'en','01M4A6BK9H4W2EDMK0MMTB080R',0 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='category' AND "slug"='產品消息' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9HMBVK0HC433ZYM3KV','category','使用教學','使用教學',NULL,NULL,'en','01M4A6BK9HMBVK0HC433ZYM3KV',1 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='category' AND "slug"='使用教學' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9JWCMAJ8HXMWJXC568','category','目的地指南','目的地指南',NULL,NULL,'en','01M4A6BK9JWCMAJ8HXMWJXC568',2 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='category' AND "slug"='目的地指南' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9K0TWS51HFNK24HZQS','tag','AI 旅行規劃','AI 旅行規劃',NULL,NULL,'en','01M4A6BK9K0TWS51HFNK24HZQS',0 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='tag' AND "slug"='AI 旅行規劃' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9KN4DA3HZATXFAE951','tag','使用教學','使用教學',NULL,NULL,'en','01M4A6BK9KN4DA3HZATXFAE951',1 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='tag' AND "slug"='使用教學' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9K7JC70R858JGXVSSR','tag','公告','公告',NULL,NULL,'en','01M4A6BK9K7JC70R858JGXVSSR',2 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='tag' AND "slug"='公告' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9KNQZF01HK4VZ6HE25','tag','新聞','新聞',NULL,NULL,'en','01M4A6BK9KNQZF01HK4VZ6HE25',3 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='tag' AND "slug"='新聞' AND "locale"='en');

INSERT OR IGNORE INTO taxonomies ("id","name","slug","label","parent_id","data","locale","translation_group","sort_order") SELECT '01M4A6BK9M65GQYGMHVGWNYAHW','tag','產品','產品',NULL,NULL,'en','01M4A6BK9M65GQYGMHVGWNYAHW',4 WHERE NOT EXISTS (SELECT 1 FROM taxonomies WHERE "name"='tag' AND "slug"='產品' AND "locale"='en');

INSERT OR IGNORE INTO _emdash_bylines ("id","slug","display_name","bio","avatar_media_id","website_url","user_id","is_guest","created_at","updated_at","locale","translation_group") SELECT '01M4A6BK9QMC4DT4R96MTTY3M4','kktrip','KK Trip','KK Trip 編輯團隊：旅行靈感、目的地指南與產品消息。',NULL,'https://kktrip.app',NULL,0,'2026-10-07T03:26:18.423Z','2026-10-07T03:26:18.423Z','en','01M4A6BK9QMC4DT4R96MTTY3M4' WHERE NOT EXISTS (SELECT 1 FROM _emdash_bylines WHERE "slug"='kktrip' AND "locale"='en');

INSERT OR IGNORE INTO _emdash_menus ("id","name","label","created_at","updated_at","locale","translation_group") SELECT '01M4A6BK9RJKEDR6HJ2B2XH1WC','primary','主要導覽','2026-10-07T03:26:18.424Z','2026-10-07T03:26:18.424Z','en','01M4A6BK9RJKEDR6HJ2B2XH1WC' WHERE NOT EXISTS (SELECT 1 FROM _emdash_menus WHERE "name"='primary' AND "locale"='en');

INSERT OR IGNORE INTO _emdash_menus ("id","name","label","created_at","updated_at","locale","translation_group") SELECT '01M4A6BK9S0H5NHKCYMCHB56JY','footer','頁尾導覽','2026-10-07T03:26:18.425Z','2026-10-07T03:26:18.425Z','en','01M4A6BK9S0H5NHKCYMCHB56JY' WHERE NOT EXISTS (SELECT 1 FROM _emdash_menus WHERE "name"='footer' AND "locale"='en');

INSERT OR IGNORE INTO _emdash_widget_areas ("id","name","label","description","created_at") SELECT '01M4A6BK9T2EKRWXSHPSHJKPM7','sidebar','旅誌側欄',NULL,'2026-10-07 03:26:18' WHERE NOT EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE "name"='sidebar');

INSERT OR IGNORE INTO _emdash_widget_areas ("id","name","label","description","created_at") SELECT '01M4A6BK9TTW53YHCCC9SFZ2ZQ','article-sidebar','文章側欄',NULL,'2026-10-07 03:26:18' WHERE NOT EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE "name"='article-sidebar');

INSERT OR IGNORE INTO _emdash_widget_areas ("id","name","label","description","created_at") SELECT '01M4A6BK9T0QXV1RBTYYA6DSA6','footer','頁尾小工具',NULL,'2026-10-07 03:26:18' WHERE NOT EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE "name"='footer');

INSERT OR IGNORE INTO _emdash_sections ("id","slug","title","description","keywords","content","preview_media_id","source","theme_id","created_at","updated_at") SELECT '01M4A6BK9T9S3YDWKBDCNFV1H3','plan-with-kktrip','用 KK Trip 規劃這趟旅行','文章結尾的旅行規劃呼籲','["KK Trip","旅行","行程"]','[{"_type":"block","_key":"plan-intro","style":"normal","markDefs":[],"children":[{"_type":"span","_key":"plan-intro-text","text":"準備好出發了嗎？讓 AI 幫你起個頭，再和旅伴一起把旅行準備好。","marks":[]}]},{"_type":"block","_key":"plan-link","style":"normal","markDefs":[{"_type":"link","_key":"link","href":"https://kktrip.app/login"}],"children":[{"_type":"span","_key":"plan-link-text","text":"開始規劃下一趟旅行 →","marks":["link"]}]}]',NULL,'theme',NULL,'2026-10-07T03:26:18.426Z','2026-10-07T03:26:18.426Z' WHERE NOT EXISTS (SELECT 1 FROM _emdash_sections WHERE "slug"='plan-with-kktrip');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9RF341XEX07RM6Y4N2','01M4A6BK9RJKEDR6HJ2B2XH1WC',NULL,0,'custom',NULL,NULL,'/','旅誌',NULL,NULL,NULL,'2026-10-07T03:26:18.424Z','en','01M4A6BK9RF341XEX07RM6Y4N2' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9RJKEDR6HJ2B2XH1WC');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9S7CCEEQN4WZ5GVAZ7','01M4A6BK9RJKEDR6HJ2B2XH1WC',NULL,1,'custom',NULL,NULL,'/category/使用教學','使用教學',NULL,NULL,NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9S7CCEEQN4WZ5GVAZ7' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9RJKEDR6HJ2B2XH1WC');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9S2NCKRNWMFWD5CFMM','01M4A6BK9RJKEDR6HJ2B2XH1WC',NULL,2,'custom',NULL,NULL,'/category/產品消息','產品消息',NULL,NULL,NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9S2NCKRNWMFWD5CFMM' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9RJKEDR6HJ2B2XH1WC');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9SP8HAPRAPKZYF6N35','01M4A6BK9RJKEDR6HJ2B2XH1WC',NULL,3,'custom',NULL,NULL,'/search','搜尋',NULL,NULL,NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9SP8HAPRAPKZYF6N35' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9RJKEDR6HJ2B2XH1WC');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9SDATH8F0Z4BQS63XS','01M4A6BK9RJKEDR6HJ2B2XH1WC',NULL,4,'custom',NULL,NULL,'https://kktrip.app','開啟 KK Trip',NULL,'_blank',NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9SDATH8F0Z4BQS63XS' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9RJKEDR6HJ2B2XH1WC');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9S3WRXXF00FRT9TG4T','01M4A6BK9S0H5NHKCYMCHB56JY',NULL,0,'custom',NULL,NULL,'/','所有文章',NULL,NULL,NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9S3WRXXF00FRT9TG4T' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9S0H5NHKCYMCHB56JY');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9STE5PVKKQ7PCA8HQ5','01M4A6BK9S0H5NHKCYMCHB56JY',NULL,1,'custom',NULL,NULL,'/search','搜尋',NULL,NULL,NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9STE5PVKKQ7PCA8HQ5' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9S0H5NHKCYMCHB56JY');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9SYAGEC5RZK0S00XJV','01M4A6BK9S0H5NHKCYMCHB56JY',NULL,2,'custom',NULL,NULL,'/rss.xml','訂閱 RSS',NULL,NULL,NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9SYAGEC5RZK0S00XJV' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9S0H5NHKCYMCHB56JY');

INSERT OR IGNORE INTO _emdash_menu_items ("id","menu_id","parent_id","sort_order","type","reference_collection","reference_id","custom_url","label","title_attr","target","css_classes","created_at","locale","translation_group") SELECT '01M4A6BK9SWAQPDCQECFPB5ZNH','01M4A6BK9S0H5NHKCYMCHB56JY',NULL,3,'custom',NULL,NULL,'https://kktrip.app/support','支援',NULL,'_blank',NULL,'2026-10-07T03:26:18.425Z','en','01M4A6BK9SWAQPDCQECFPB5ZNH' WHERE EXISTS (SELECT 1 FROM _emdash_menus WHERE id='01M4A6BK9S0H5NHKCYMCHB56JY');

INSERT OR IGNORE INTO _emdash_widgets ("id","area_id","sort_order","type","title","content","menu_name","component_id","component_props","created_at") SELECT '01M4A6BK9T2GE80CD39NK6S94D','01M4A6BK9T2EKRWXSHPSHJKPM7',0,'component','搜尋旅誌',NULL,NULL,'core:search','{"placeholder":"搜尋文章"}','2026-10-07 03:26:18' WHERE EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE id='01M4A6BK9T2EKRWXSHPSHJKPM7');

INSERT OR IGNORE INTO _emdash_widgets ("id","area_id","sort_order","type","title","content","menu_name","component_id","component_props","created_at") SELECT '01M4A6BK9TXV22PM3E55RAEC3C','01M4A6BK9T2EKRWXSHPSHJKPM7',1,'component','分類',NULL,NULL,'core:categories','{"showCount":true}','2026-10-07 03:26:18' WHERE EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE id='01M4A6BK9T2EKRWXSHPSHJKPM7');

INSERT OR IGNORE INTO _emdash_widgets ("id","area_id","sort_order","type","title","content","menu_name","component_id","component_props","created_at") SELECT '01M4A6BK9TDY2G6NS6Q9Z4Y9HK','01M4A6BK9TTW53YHCCC9SFZ2ZQ',0,'component','最新文章',NULL,NULL,'core:recent-posts','{"count":3,"showDate":false}','2026-10-07 03:26:18' WHERE EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE id='01M4A6BK9TTW53YHCCC9SFZ2ZQ');

INSERT OR IGNORE INTO _emdash_widgets ("id","area_id","sort_order","type","title","content","menu_name","component_id","component_props","created_at") SELECT '01M4A6BK9TYMR05C6AJFN2GBST','01M4A6BK9TTW53YHCCC9SFZ2ZQ',1,'content','下一趟旅行','[{"_type":"block","_key":"app-cta","style":"normal","markDefs":[{"_type":"link","_key":"link","href":"https://kktrip.app/login"}],"children":[{"_type":"span","_key":"app-cta-text","text":"用 KK Trip 規劃你的下一趟旅行","marks":["link"]}]}]',NULL,NULL,NULL,'2026-10-07 03:26:18' WHERE EXISTS (SELECT 1 FROM _emdash_widget_areas WHERE id='01M4A6BK9TTW53YHCCC9SFZ2ZQ');

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='tag' AND t.slug='新聞' AND t.locale=p.locale WHERE p.slug='kk-trip-now-on-app-store' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='tag' AND t.slug='公告' AND t.locale=p.locale WHERE p.slug='kk-trip-now-on-app-store' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='category' AND t.slug='產品消息' AND t.locale=p.locale WHERE p.slug='kk-trip-now-on-app-store' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT INTO _emdash_content_bylines (id,collection_slug,content_id,byline_id,sort_order,role_label,created_at) SELECT '26N4BPD68AQ8DTW2RVZP9TDEQA','posts',p.translation_group,b.translation_group,0,'編輯團隊',datetime('now') FROM ec_posts p JOIN _emdash_bylines b ON b.slug='kktrip' AND b.locale=p.locale WHERE p.slug='kk-trip-now-on-app-store' AND p.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM _emdash_content_bylines x WHERE x.collection_slug='posts' AND x.content_id=p.translation_group);

UPDATE ec_posts SET tags=NULL,author_display=NULL WHERE slug='kk-trip-now-on-app-store' AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM content_taxonomies ct WHERE ct.collection='posts' AND ct.entry_id=ec_posts.translation_group) AND EXISTS (SELECT 1 FROM _emdash_content_bylines cb WHERE cb.collection_slug='posts' AND cb.content_id=ec_posts.translation_group);

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='tag' AND t.slug='產品' AND t.locale=p.locale WHERE p.slug='why-kk-trip' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='tag' AND t.slug='AI 旅行規劃' AND t.locale=p.locale WHERE p.slug='why-kk-trip' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='category' AND t.slug='產品消息' AND t.locale=p.locale WHERE p.slug='why-kk-trip' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT INTO _emdash_content_bylines (id,collection_slug,content_id,byline_id,sort_order,role_label,created_at) SELECT '0J38NSPG6XZY70C4MTQN01R4B4','posts',p.translation_group,b.translation_group,0,'編輯團隊',datetime('now') FROM ec_posts p JOIN _emdash_bylines b ON b.slug='kktrip' AND b.locale=p.locale WHERE p.slug='why-kk-trip' AND p.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM _emdash_content_bylines x WHERE x.collection_slug='posts' AND x.content_id=p.translation_group);

UPDATE ec_posts SET tags=NULL,author_display=NULL WHERE slug='why-kk-trip' AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM content_taxonomies ct WHERE ct.collection='posts' AND ct.entry_id=ec_posts.translation_group) AND EXISTS (SELECT 1 FROM _emdash_content_bylines cb WHERE cb.collection_slug='posts' AND cb.content_id=ec_posts.translation_group);

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='tag' AND t.slug='使用教學' AND t.locale=p.locale WHERE p.slug='how-to-use-kk-trip' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='tag' AND t.slug='AI 旅行規劃' AND t.locale=p.locale WHERE p.slug='how-to-use-kk-trip' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT OR IGNORE INTO content_taxonomies (collection,entry_id,taxonomy_id) SELECT 'posts',p.translation_group,t.translation_group FROM ec_posts p JOIN taxonomies t ON t.name='category' AND t.slug='使用教學' AND t.locale=p.locale WHERE p.slug='how-to-use-kk-trip' AND p.deleted_at IS NULL AND p.tags IS NOT NULL;

INSERT INTO _emdash_content_bylines (id,collection_slug,content_id,byline_id,sort_order,role_label,created_at) SELECT '45SQ71WHQ6XRXMVMDAYN02ZA6A','posts',p.translation_group,b.translation_group,0,'編輯團隊',datetime('now') FROM ec_posts p JOIN _emdash_bylines b ON b.slug='kktrip' AND b.locale=p.locale WHERE p.slug='how-to-use-kk-trip' AND p.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM _emdash_content_bylines x WHERE x.collection_slug='posts' AND x.content_id=p.translation_group);

UPDATE ec_posts SET tags=NULL,author_display=NULL WHERE slug='how-to-use-kk-trip' AND deleted_at IS NULL AND EXISTS (SELECT 1 FROM content_taxonomies ct WHERE ct.collection='posts' AND ct.entry_id=ec_posts.translation_group) AND EXISTS (SELECT 1 FROM _emdash_content_bylines cb WHERE cb.collection_slug='posts' AND cb.content_id=ec_posts.translation_group);
