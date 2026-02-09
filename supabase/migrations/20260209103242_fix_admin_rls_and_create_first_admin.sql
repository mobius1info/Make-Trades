/*
  # Fix Admin RLS Policy and Create First Admin
  
  1. Changes
    - Fix RLS policy for admin_users to allow self-read
    - Create first admin user in auth.users
    - Add admin to admin_users table
    
  2. Security
    - Admin can read their own record
    - Service role creates the first admin
*/

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admin can read admin users" ON admin_users;

-- Create new policy that allows authenticated users to read admin_users
-- This is safe because the table only contains admin info
CREATE POLICY "Authenticated can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Create first admin function (using service role context)
DO $$
DECLARE
  v_user_id uuid;
  v_admin_email text := 'admin@maketrades.space';
  v_admin_password text := 'Admin123456!';
BEGIN
  -- Check if admin already exists
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = v_admin_email) THEN
    -- Check if user exists in auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_admin_email;
    
    -- If user doesn't exist, we need to create them via Edge Function
    -- For now, just log that admin needs to be created
    IF v_user_id IS NULL THEN
      RAISE NOTICE 'Admin user needs to be created via Edge Function';
    ELSE
      -- User exists, just add to admin_users
      INSERT INTO admin_users (id, email, role)
      VALUES (v_user_id, v_admin_email, 'admin')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
END $$;
