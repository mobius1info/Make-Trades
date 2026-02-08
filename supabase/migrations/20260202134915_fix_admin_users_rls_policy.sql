/*
  # Fix Admin Users RLS Policy

  1. Changes
    - Drop the circular dependency policy for admin_users SELECT
    - Create a new policy that allows users to read their own record
    - This fixes the login issue where users couldn't authenticate

  2. Security
    - Authenticated users can only read their own admin_users record
    - No circular dependency in policy checks
*/

-- Drop the old policy that has circular dependency
DROP POLICY IF EXISTS "Admin can read admin users" ON admin_users;

-- Create new policy: authenticated users can read their own admin record
CREATE POLICY "Users can read own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());
