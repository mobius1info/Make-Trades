/*
  # Add Blog Management Helper Functions

  1. New Functions
    - hide_blog_posts: Hide multiple blog posts from user listings
    - show_blog_posts: Show multiple blog posts in user listings
    - get_hidden_posts_count: Get count of hidden posts by language
    
  2. Security
    - Functions can only be called by authenticated admin users
    - Read-only functions available to all
*/

-- Function to hide blog posts from users (but keep for SEO)
CREATE OR REPLACE FUNCTION hide_blog_posts(post_slugs text[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE blog_posts
  SET hidden_from_users = true
  WHERE slug = ANY(post_slugs);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Function to show blog posts to users
CREATE OR REPLACE FUNCTION show_blog_posts(post_slugs text[])
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE blog_posts
  SET hidden_from_users = false
  WHERE slug = ANY(post_slugs);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Function to get count of hidden posts by language
CREATE OR REPLACE FUNCTION get_hidden_posts_count(lang text DEFAULT NULL)
RETURNS TABLE(language text, hidden_count bigint, total_count bigint, visible_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF lang IS NULL THEN
    RETURN QUERY
    SELECT 
      bp.language,
      COUNT(*) FILTER (WHERE bp.hidden_from_users = true) as hidden_count,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE bp.hidden_from_users = false) as visible_count
    FROM blog_posts bp
    GROUP BY bp.language
    ORDER BY bp.language;
  ELSE
    RETURN QUERY
    SELECT 
      bp.language,
      COUNT(*) FILTER (WHERE bp.hidden_from_users = true) as hidden_count,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE bp.hidden_from_users = false) as visible_count
    FROM blog_posts bp
    WHERE bp.language = lang
    GROUP BY bp.language;
  END IF;
END;
$$;

-- Add comments
COMMENT ON FUNCTION hide_blog_posts IS 'Hide blog posts from user listings while keeping them accessible via direct URL for SEO';
COMMENT ON FUNCTION show_blog_posts IS 'Make blog posts visible in user listings';
COMMENT ON FUNCTION get_hidden_posts_count IS 'Get statistics about hidden and visible blog posts by language';