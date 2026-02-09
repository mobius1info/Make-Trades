/*
  # Fix RLS policies for demo_requests and contact_submissions

  1. Changes
    - Drop existing INSERT policies that use TO public
    - Recreate INSERT policies with explicit TO anon, authenticated roles
    - This ensures anonymous website visitors can submit forms via Supabase client

  2. Affected tables
    - `demo_requests` - demo account request form
    - `contact_submissions` - contact form
*/

DROP POLICY IF EXISTS "Anyone can submit demo requests" ON demo_requests;

CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit contact forms" ON contact_submissions;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);