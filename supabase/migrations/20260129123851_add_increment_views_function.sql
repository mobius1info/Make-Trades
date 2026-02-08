/*
  # Add View Counter Function
  
  1. Changes
    - Create PostgreSQL function to increment post views
    - Add RPC function for client-side calls
  
  2. Function Details
    - `increment_post_views` - Safely increments the views counter for a blog post
    - Uses atomic increment to prevent race conditions
*/

-- Create function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$;
