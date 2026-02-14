/*
  # Fix RLS Performance and Security Issues

  ## Changes Made
  
  1. **RLS Policy Performance Optimization**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation for each row, improving query performance
  
  2. **Remove Unused Index**
     - Drop `idx_blog_posts_publish_date` (not being used)
  
  3. **Fix Multiple Permissive Policies**
     - Drop redundant `Authenticated can read admin users` policy
     - Keep only `Users can read own admin record` for better security
  
  4. **Fix Function Search Path**
     - Add `SET search_path = ''` to all mutable functions
  
  5. **Security Notes**
     - INSERT policies with `true` are intentional (public forms)
     - Password leak protection should be enabled via Supabase dashboard
*/

-- ============================================
-- 1. Drop and recreate translations policies
-- ============================================

DROP POLICY IF EXISTS "Admin can insert translations" ON translations;
DROP POLICY IF EXISTS "Admin can update translations" ON translations;
DROP POLICY IF EXISTS "Admin can delete translations" ON translations;

CREATE POLICY "Admin can insert translations"
  ON translations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can update translations"
  ON translations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can delete translations"
  ON translations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ============================================
-- 2. Drop and recreate site_images policies
-- ============================================

DROP POLICY IF EXISTS "Admin can insert images" ON site_images;
DROP POLICY IF EXISTS "Admin can update images" ON site_images;
DROP POLICY IF EXISTS "Admin can delete images" ON site_images;

CREATE POLICY "Admin can insert images"
  ON site_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can update images"
  ON site_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can delete images"
  ON site_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ============================================
-- 3. Drop and recreate admin_users policies
-- ============================================

DROP POLICY IF EXISTS "Admin can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can read own admin record" ON admin_users;
DROP POLICY IF EXISTS "Authenticated can read admin users" ON admin_users;

CREATE POLICY "Admin can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.id = (select auth.uid())
    )
  );

CREATE POLICY "Admin can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.id = (select auth.uid())
    )
  );

CREATE POLICY "Users can read own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

-- ============================================
-- 4. Drop and recreate blog_posts policies
-- ============================================

DROP POLICY IF EXISTS "Admin can manage all blog posts" ON blog_posts;

CREATE POLICY "Admin can manage all blog posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ============================================
-- 5. Drop and recreate leads policies
-- ============================================

DROP POLICY IF EXISTS "Admins can view leads" ON leads;
DROP POLICY IF EXISTS "Admins can update leads" ON leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON leads;

CREATE POLICY "Admins can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- ============================================
-- 6. Remove unused index
-- ============================================

DROP INDEX IF EXISTS idx_blog_posts_publish_date;

-- ============================================
-- 7. Fix function search paths
-- ============================================

CREATE OR REPLACE FUNCTION hide_blog_posts(post_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET hidden_from_users = true
  WHERE id = ANY(post_ids);
END;
$$;

CREATE OR REPLACE FUNCTION show_blog_posts(post_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET hidden_from_users = false
  WHERE id = ANY(post_ids);
END;
$$;

CREATE OR REPLACE FUNCTION get_hidden_posts_count()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  count_val bigint;
BEGIN
  SELECT COUNT(*) INTO count_val
  FROM public.blog_posts
  WHERE hidden_from_users = true;
  
  RETURN count_val;
END;
$$;

CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET published = true
  WHERE published = false
    AND publish_date <= NOW();
END;
$$;

CREATE OR REPLACE FUNCTION get_next_publish_date()
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
    AND publish_date > NOW();
  
  RETURN next_date;
END;
$$;
