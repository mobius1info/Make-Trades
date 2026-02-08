/*
  # Add Hidden from Users Column for SEO-Only Content

  1. Changes
    - Add `hidden_from_users` column to blog_posts table
    - This allows content to be hidden from site users but visible to search engines
    - Default value is false (visible to all)
    - When true, the article won't appear in lists but will be accessible via direct URL for SEO bots
    
  2. Notes
    - Search engines can still crawl and index these pages
    - Users won't see these articles in blog listing pages
    - Direct URL access still works for SEO purposes
*/

-- Add hidden_from_users column
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS hidden_from_users boolean DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_hidden_from_users 
ON blog_posts(hidden_from_users) 
WHERE hidden_from_users = false;

-- Add comment
COMMENT ON COLUMN blog_posts.hidden_from_users IS 'When true, article is hidden from user-facing lists but accessible via direct URL for SEO';