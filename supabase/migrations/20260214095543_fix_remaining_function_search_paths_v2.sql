/*
  # Fix Remaining Function Search Paths V2

  ## Changes
  
  Fix search_path for overloaded function versions by dropping and recreating them
*/

-- Drop and recreate hide_blog_posts with slug parameter
DROP FUNCTION IF EXISTS hide_blog_posts(text[]);

CREATE FUNCTION hide_blog_posts(post_slugs text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET hidden_from_users = true
  WHERE slug = ANY(post_slugs);
END;
$$;

-- Drop and recreate show_blog_posts with slug parameter
DROP FUNCTION IF EXISTS show_blog_posts(text[]);

CREATE FUNCTION show_blog_posts(post_slugs text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET hidden_from_users = false
  WHERE slug = ANY(post_slugs);
END;
$$;

-- Drop and recreate get_hidden_posts_count with language parameter
DROP FUNCTION IF EXISTS get_hidden_posts_count(text);

CREATE FUNCTION get_hidden_posts_count(lang text DEFAULT NULL)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  count_val bigint;
BEGIN
  IF lang IS NULL THEN
    SELECT COUNT(*) INTO count_val
    FROM public.blog_posts
    WHERE hidden_from_users = true;
  ELSE
    SELECT COUNT(*) INTO count_val
    FROM public.blog_posts
    WHERE hidden_from_users = true AND language = lang;
  END IF;
  
  RETURN count_val;
END;
$$;

-- Drop and recreate get_next_publish_date with language parameter
DROP FUNCTION IF EXISTS get_next_publish_date(text);

CREATE FUNCTION get_next_publish_date(lang text)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  next_date timestamptz;
BEGIN
  SELECT MIN(publish_date) INTO next_date
  FROM public.blog_posts
  WHERE published = false
    AND publish_date > NOW()
    AND language = lang;
  
  RETURN next_date;
END;
$$;
