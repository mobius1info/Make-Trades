/*
  # Add canonical blog article groups and indexability controls

  ## Why
  The current blog stores each language version as an isolated row. This migration
  introduces a canonical article-group layer so one topic can be linked across
  `ru`, `en`, `de`, `uk`, and `zh`, while low-quality or merged content can be
  kept accessible but safely removed from the index.

  ## New structures
  - `blog_article_groups`
    - Canonical topic entity shared by all language versions
    - Stores group key, focus and indexability defaults
  - New columns on `blog_posts`
    - `article_group_key`
    - `content_status` (`core`, `merged`, `archived`)
    - `indexable`
    - `canonical_target_group_key`

  ## Notes
  - This migration is intentionally schema-first.
  - Group membership data can be populated from the project-side manifest
    `src/blog-article-groups.json` or a follow-up SQL seed once production is ready.
*/

CREATE TABLE IF NOT EXISTS blog_article_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key text NOT NULL UNIQUE,
  topic_label text NOT NULL,
  focus_area text NOT NULL DEFAULT 'b2b',
  default_language text NOT NULL DEFAULT 'ru',
  indexable boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_article_groups ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_article_groups'
      AND policyname = 'Anyone can read blog article groups'
  ) THEN
    CREATE POLICY "Anyone can read blog article groups"
      ON blog_article_groups FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'article_group_key'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN article_group_key text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'content_status'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN content_status text NOT NULL DEFAULT 'archived';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'indexable'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN indexable boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'canonical_target_group_key'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN canonical_target_group_key text;
  END IF;
END $$;

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_content_status_check;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_content_status_check
  CHECK (content_status IN ('core', 'merged', 'archived'));

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_article_group_key_fkey;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_article_group_key_fkey
  FOREIGN KEY (article_group_key)
  REFERENCES blog_article_groups(group_key)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_canonical_target_group_key_fkey;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_canonical_target_group_key_fkey
  FOREIGN KEY (canonical_target_group_key)
  REFERENCES blog_article_groups(group_key)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_article_group_key
  ON blog_posts(article_group_key);

CREATE INDEX IF NOT EXISTS idx_blog_posts_indexable_language
  ON blog_posts(indexable, language, published);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_unique_core_translation
  ON blog_posts(article_group_key, language)
  WHERE article_group_key IS NOT NULL AND content_status = 'core';

COMMENT ON TABLE blog_article_groups IS 'Canonical multilingual article entities for the MakeTrades blog.';
COMMENT ON COLUMN blog_posts.article_group_key IS 'Canonical multilingual article group key.';
COMMENT ON COLUMN blog_posts.content_status IS 'core = indexable primary article, merged = duplicate intent, archived = non-core legacy article.';
COMMENT ON COLUMN blog_posts.indexable IS 'Whether the row should appear in listings, sitemap and indexable SEO output.';
COMMENT ON COLUMN blog_posts.canonical_target_group_key IS 'Target canonical article group for merged content.';
