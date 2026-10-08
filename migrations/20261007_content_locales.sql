-- Existing editorial content was written in Traditional Chinese before i18n
-- was configured. Relabel only the audited rows; preserve IDs, URLs, revisions
-- and publishing state. Safe to reapply; future English content is untouched.
UPDATE ec_posts SET locale = 'zh-TW' WHERE locale = 'en' AND id IN (
 '01M4A59P3028NQNWCS99ZVW334', '01M4A59PW5AT1Y9084K35RX2N2',
 '01M4A59QK1N52556W4PWN6D3PF', '01M4A65KPMXVRCAETG98687YN0',
 '01M4CHWQTPZEAWASVVTKVWF0D7'
);
UPDATE _emdash_menus SET locale = 'zh-TW' WHERE locale = 'en' AND name IN ('primary', 'footer');
UPDATE _emdash_taxonomy_defs SET locale = 'zh-TW' WHERE locale = 'en' AND id IN ('taxdef_category', 'taxdef_tag');
UPDATE taxonomies SET locale = 'zh-TW' WHERE locale = 'en' AND id IN (
 '01M4A6BK9H4W2EDMK0MMTB080R', '01M4A6BK9HMBVK0HC433ZYM3KV', '01M4A6BK9JWCMAJ8HXMWJXC568',
 '01M4A6BK9K0TWS51HFNK24HZQS', '01M4A6BK9KN4DA3HZATXFAE951', '01M4A6BK9K7JC70R858JGXVSSR',
 '01M4A6BK9KNQZF01HK4VZ6HE25', '01M4A6BK9M65GQYGMHVGWNYAHW'
);
UPDATE _emdash_bylines SET locale = 'zh-TW' WHERE locale = 'en' AND id IN (
 '01M4A6BK9QMC4DT4R96MTTY3M4', '01M4AB7XC3FSDAVE670JVK7H5V'
);
