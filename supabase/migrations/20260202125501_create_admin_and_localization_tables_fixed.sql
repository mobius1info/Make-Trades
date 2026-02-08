/*
  # Create Admin Panel and Localization Tables

  1. New Tables
    - `translations`: Stores all UI text translations
    - `site_images`: Stores all site images with metadata
    - `admin_users`: Admin users table

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  language text NOT NULL,
  value text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(key, language)
);

-- Create site_images table
CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  url text NOT NULL,
  alt_text text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for translations
CREATE POLICY "Anyone can read translations"
  ON translations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can insert translations"
  ON translations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin can update translations"
  ON translations FOR UPDATE
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

CREATE POLICY "Admin can delete translations"
  ON translations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for site_images
CREATE POLICY "Anyone can read images"
  ON site_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can insert images"
  ON site_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin can update images"
  ON site_images FOR UPDATE
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

CREATE POLICY "Admin can delete images"
  ON site_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Policies for admin_users
CREATE POLICY "Admin can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admin can update admin users"
  ON admin_users FOR UPDATE
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

CREATE POLICY "Admin can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Update blog_posts policies for admin management
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'blog_posts' AND policyname = 'Admin can manage all blog posts'
  ) THEN
    CREATE POLICY "Admin can manage all blog posts"
      ON blog_posts FOR ALL
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
  END IF;
END $$;

-- Insert default translations for buttons
INSERT INTO translations (key, language, value, category) VALUES
  ('button.login', 'ru', 'Личный кабинет', 'buttons'),
  ('button.login', 'en', 'Личный кабинет', 'buttons'),
  ('button.login', 'de', 'Личный кабинет', 'buttons'),
  ('button.login', 'uk', 'Личный кабинет', 'buttons'),
  ('button.login', 'zh', 'Личный кабинет', 'buttons'),
  
  ('pricing.from', 'ru', 'От', 'pricing'),
  ('pricing.from', 'en', 'От', 'pricing'),
  ('pricing.from', 'de', 'От', 'pricing'),
  ('pricing.from', 'uk', 'От', 'pricing'),
  ('pricing.from', 'zh', 'От', 'pricing'),
  
  ('pricing.amount', 'ru', '$1000-3000', 'pricing'),
  ('pricing.amount', 'en', '$1000-3000', 'pricing'),
  ('pricing.amount', 'de', '$1000-3000', 'pricing'),
  ('pricing.amount', 'uk', '$1000-3000', 'pricing'),
  ('pricing.amount', 'zh', '$1000-3000', 'pricing'),
  
  ('pricing.period', 'ru', 'в месяц', 'pricing'),
  ('pricing.period', 'en', 'в месяц', 'pricing'),
  ('pricing.period', 'de', 'в месяц', 'pricing'),
  ('pricing.period', 'uk', 'в месяц', 'pricing'),
  ('pricing.period', 'zh', 'в месяц', 'pricing'),
  
  ('button.request_demo', 'ru', 'Запросить демо-аккаунт', 'buttons'),
  ('button.request_demo', 'en', 'Запросить демо-аккаунт', 'buttons'),
  ('button.request_demo', 'de', 'Запросить демо-аккаунт', 'buttons'),
  ('button.request_demo', 'uk', 'Запросить демо-аккаунт', 'buttons'),
  ('button.request_demo', 'zh', 'Запросить демо-аккаунт', 'buttons')
ON CONFLICT (key, language) DO NOTHING;
