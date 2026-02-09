/*
  # Create unified leads table

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text) - contact name
      - `email` (text) - contact email
      - `telegram` (text, nullable) - telegram handle
      - `message` (text, nullable) - message from contact form
      - `source` (text) - 'demo' or 'contact'
      - `language` (text) - language the form was submitted in
      - `is_new` (boolean, default true) - whether admin has seen this lead
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `leads` table
    - Anonymous users can INSERT (public forms)
    - Authenticated admin users can SELECT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL,
  telegram text,
  message text,
  source text NOT NULL DEFAULT 'demo',
  language text NOT NULL DEFAULT 'ru',
  is_new boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete leads"
  ON leads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
