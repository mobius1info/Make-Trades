/*
  # Reschedule all unpublished articles to every 2 days

  1. Modified Tables
    - `blog_posts` - Updated publish_date for all unpublished posts
  2. Changes
    - Articles 11-30: scheduled every 2 days starting Feb 9, 2026
    - Articles 31-100: scheduled every 2 days continuing after article 30
*/

DO $$
DECLARE
  article_num INT;
  target_date DATE;
BEGIN
  FOR article_num IN 11..100 LOOP
    target_date := '2026-02-09'::date + ((article_num - 11) * 2) * INTERVAL '1 day';
    UPDATE blog_posts
    SET publish_date = target_date
    WHERE slug LIKE 'article-' || article_num || '-%'
      AND published = false;
  END LOOP;
END $$;