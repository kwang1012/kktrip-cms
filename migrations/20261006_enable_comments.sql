-- Public article discussion; every submission requires editorial approval.
UPDATE _emdash_collections
SET comments_enabled = 1,
    comments_moderation = 'all',
    comments_auto_approve_users = 0
WHERE slug = 'posts';
