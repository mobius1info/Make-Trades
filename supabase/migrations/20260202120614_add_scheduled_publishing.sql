/*
  # Add Scheduled Publishing for Blog Posts

  1. Changes
    - Add `publish_date` column to blog_posts table
    - Add index on publish_date for faster queries
    - Create function to auto-publish posts based on publish_date
    - Create function to get next available publish date

  2. Notes
    - Posts with publish_date in the future will remain unpublished until that date
    - Posts without publish_date will be published immediately if published=true
    - One post per day will be automatically published
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'publish_date'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN publish_date timestamptz DEFAULT now();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON blog_posts(publish_date);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published, publish_date);

CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET published = true
  WHERE published = false
    AND publish_date <= now()
    AND publish_date IS NOT NULL;
END;
$$;

CREATE OR REPLACE FUNCTION get_next_publish_date(lang text)
RETURNS timestamptz
LANGUAGE plpgsql
AS $$
DECLARE
  last_date timestamptz;
  next_date timestamptz;
BEGIN
  SELECT MAX(publish_date)
  INTO last_date
  FROM blog_posts
  WHERE language = lang;
  
  IF last_date IS NULL THEN
    next_date := date_trunc('day', now());
  ELSIF last_date < now() THEN
    next_date := date_trunc('day', now());
  ELSE
    next_date := last_date + interval '1 day';
  END IF;
  
  RETURN next_date;
END;
$$;