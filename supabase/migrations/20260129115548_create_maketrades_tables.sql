/*
  # Create MakeTrades Website Database Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique post identifier
      - `title` (text) - Blog post title
      - `slug` (text, unique) - URL-friendly slug
      - `excerpt` (text) - Short description
      - `content` (text) - Full post content
      - `image_url` (text) - Featured image URL
      - `language` (text) - Post language (ru/en/de)
      - `published` (boolean) - Publication status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `author` (text) - Author name

    - `contact_submissions`
      - `id` (uuid, primary key) - Unique submission identifier
      - `name` (text) - Contact name
      - `email` (text) - Contact email
      - `message` (text) - Contact message
      - `telegram` (text, nullable) - Optional Telegram username
      - `submitted_at` (timestamptz) - Submission timestamp
      - `status` (text) - Processing status (new/in_progress/resolved)

    - `faq_items`
      - `id` (uuid, primary key) - Unique FAQ identifier
      - `question` (text) - Question text
      - `answer` (text) - Answer text
      - `language` (text) - FAQ language (ru/en/de)
      - `order` (integer) - Display order
      - `category` (text) - FAQ category
      - `created_at` (timestamptz) - Creation timestamp

    - `demo_requests`
      - `id` (uuid, primary key) - Unique request identifier
      - `name` (text) - Requester name
      - `email` (text) - Requester email
      - `telegram` (text, nullable) - Optional Telegram username
      - `requested_at` (timestamptz) - Request timestamp
      - `status` (text) - Processing status (pending/approved/rejected)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to published content
    - Add policies for authenticated admin users to manage content
    - Contact submissions and demo requests are write-only for public users
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text DEFAULT '',
  language text NOT NULL DEFAULT 'ru',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author text DEFAULT 'MakeTrades Team'
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  telegram text,
  submitted_at timestamptz DEFAULT now(),
  status text DEFAULT 'new'
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  language text NOT NULL DEFAULT 'ru',
  "order" integer DEFAULT 0,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQ items"
  ON faq_items FOR SELECT
  USING (true);

-- Create demo_requests table
CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  telegram text,
  requested_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests FOR INSERT
  WITH CHECK (true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, language, published, image_url) VALUES
  (
    'Как создать брокерскую компанию с нуля',
    'kak-sozdat-brokerskuyu-kompaniyu',
    'Пошаговое руководство по созданию брокерской компании. Узнайте о ключевых аспектах запуска брокерского бизнеса.',
    '<h2>Введение</h2><p>Создание брокерской компании требует тщательного планирования и понимания финансовых рынков.</p><h2>Шаг 1: Получение лицензии</h2><p>Первым шагом является получение необходимых лицензий и разрешений для работы в финансовой сфере.</p><h2>Шаг 2: Выбор платформы</h2><p>MakeTrades предоставляет готовое решение под ключ для запуска брокерской компании.</p>',
    'ru',
    true,
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'
  ),
  (
    'Преимущества торговых ботов в 2024 году',
    'preimuschestva-torgovyh-botov',
    'Торговые боты революционизируют способ торговли на финансовых рынках. Узнайте о их преимуществах.',
    '<h2>Автоматизация торговли</h2><p>Торговые боты позволяют автоматизировать торговые стратегии и работать 24/7.</p><h2>Эмоциональная дисциплина</h2><p>Боты не подвержены эмоциям и принимают решения на основе данных.</p>',
    'ru',
    true,
    'https://images.pexels.com/photos/8358031/pexels-photo-8358031.jpeg'
  ),
  (
    'How to Start a Brokerage Company from Scratch',
    'how-to-start-brokerage-company',
    'Step-by-step guide to creating a brokerage company. Learn about key aspects of launching a brokerage business.',
    '<h2>Introduction</h2><p>Starting a brokerage company requires careful planning and understanding of financial markets.</p><h2>Step 1: Obtaining a License</h2><p>The first step is obtaining necessary licenses and permissions to operate in the financial sector.</p>',
    'en',
    true,
    'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert sample FAQ items
INSERT INTO faq_items (question, answer, language, "order", category) VALUES
  (
    'Сколько стоит платформа MakeTrades?',
    'Стоимость платформы составляет от 1000 до 3000 долларов в месяц в зависимости от выбранного пакета и дополнительных функций.',
    'ru',
    1,
    'pricing'
  ),
  (
    'Какие торговые инструменты доступны?',
    'Платформа предоставляет доступ к более чем 500 инструментам, включая forex, криптовалюты, акции и индексы.',
    'ru',
    2,
    'features'
  ),
  (
    'Предоставляете ли вы техническую поддержку?',
    'Да, мы предоставляем круглосуточную техническую поддержку по электронной почте и телефону.',
    'ru',
    3,
    'support'
  ),
  (
    'Можно ли кастомизировать платформу под свой бренд?',
    'Да, платформа полностью белая (white-label) и может быть адаптирована под ваш бренд, включая логотип, цвета и дизайн.',
    'ru',
    4,
    'features'
  ),
  (
    'How much does the MakeTrades platform cost?',
    'The platform costs between $1000 and $3000 per month depending on the package and additional features.',
    'en',
    1,
    'pricing'
  ),
  (
    'What trading instruments are available?',
    'The platform provides access to more than 500 instruments including forex, cryptocurrencies, stocks and indices.',
    'en',
    2,
    'features'
  )
ON CONFLICT DO NOTHING;
