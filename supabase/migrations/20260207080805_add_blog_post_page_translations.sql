/*
  # Add blog post page-specific translations

  1. New Translation Keys
    - Blog post page: loading, error, not found, back to blog, tags label
    - Blog post CTA section
    - Related posts title
    - Reading time label, author role
    - Blog nav button
  
  2. Languages
    - Russian (ru), English (en), German (de), Ukrainian (uk), Chinese (zh)
*/

INSERT INTO translations (key, language, value, category) VALUES
  ('blog_post.loading', 'ru', 'Загрузка статьи...', 'blog_post'),
  ('blog_post.loading', 'en', 'Loading article...', 'blog_post'),
  ('blog_post.loading', 'de', 'Artikel wird geladen...', 'blog_post'),
  ('blog_post.loading', 'uk', 'Завантаження статті...', 'blog_post'),
  ('blog_post.loading', 'zh', '加载文章中...', 'blog_post'),

  ('blog_post.not_found_title', 'ru', 'Статья не найдена', 'blog_post'),
  ('blog_post.not_found_title', 'en', 'Article not found', 'blog_post'),
  ('blog_post.not_found_title', 'de', 'Artikel nicht gefunden', 'blog_post'),
  ('blog_post.not_found_title', 'uk', 'Статтю не знайдено', 'blog_post'),
  ('blog_post.not_found_title', 'zh', '文章未找到', 'blog_post'),

  ('blog_post.not_found_desc', 'ru', 'К сожалению, запрашиваемая статья не найдена.', 'blog_post'),
  ('blog_post.not_found_desc', 'en', 'Unfortunately, the requested article was not found.', 'blog_post'),
  ('blog_post.not_found_desc', 'de', 'Leider wurde der angeforderte Artikel nicht gefunden.', 'blog_post'),
  ('blog_post.not_found_desc', 'uk', 'На жаль, запитувана стаття не знайдена.', 'blog_post'),
  ('blog_post.not_found_desc', 'zh', '很抱歉，未找到请求的文章。', 'blog_post'),

  ('blog_post.back_to_blog', 'ru', 'Вернуться к блогу', 'blog_post'),
  ('blog_post.back_to_blog', 'en', 'Back to blog', 'blog_post'),
  ('blog_post.back_to_blog', 'de', 'Zurück zum Blog', 'blog_post'),
  ('blog_post.back_to_blog', 'uk', 'Повернутися до блогу', 'blog_post'),
  ('blog_post.back_to_blog', 'zh', '返回博客', 'blog_post'),

  ('blog_post.tags', 'ru', 'Теги:', 'blog_post'),
  ('blog_post.tags', 'en', 'Tags:', 'blog_post'),
  ('blog_post.tags', 'de', 'Tags:', 'blog_post'),
  ('blog_post.tags', 'uk', 'Теги:', 'blog_post'),
  ('blog_post.tags', 'zh', '标签：', 'blog_post'),

  ('blog_post.min_read', 'ru', 'мин чтения', 'blog_post'),
  ('blog_post.min_read', 'en', 'min read', 'blog_post'),
  ('blog_post.min_read', 'de', 'Min. Lesezeit', 'blog_post'),
  ('blog_post.min_read', 'uk', 'хв читання', 'blog_post'),
  ('blog_post.min_read', 'zh', '分钟阅读', 'blog_post'),

  ('blog_post.author_role', 'ru', 'Эксперт MakeTrades', 'blog_post'),
  ('blog_post.author_role', 'en', 'MakeTrades Expert', 'blog_post'),
  ('blog_post.author_role', 'de', 'MakeTrades-Experte', 'blog_post'),
  ('blog_post.author_role', 'uk', 'Експерт MakeTrades', 'blog_post'),
  ('blog_post.author_role', 'zh', 'MakeTrades专家', 'blog_post'),

  ('blog_post.cta_title', 'ru', 'Готовы запустить свою брокерскую платформу?', 'blog_post'),
  ('blog_post.cta_title', 'en', 'Ready to launch your brokerage platform?', 'blog_post'),
  ('blog_post.cta_title', 'de', 'Bereit, Ihre Broker-Plattform zu starten?', 'blog_post'),
  ('blog_post.cta_title', 'uk', 'Готові запустити свою брокерську платформу?', 'blog_post'),
  ('blog_post.cta_title', 'zh', '准备启动您的经纪平台？', 'blog_post'),

  ('blog_post.cta_desc', 'ru', 'MakeTrades предоставляет все необходимые инструменты для успешного старта', 'blog_post'),
  ('blog_post.cta_desc', 'en', 'MakeTrades provides all the tools you need for a successful start', 'blog_post'),
  ('blog_post.cta_desc', 'de', 'MakeTrades bietet alle notwendigen Tools für einen erfolgreichen Start', 'blog_post'),
  ('blog_post.cta_desc', 'uk', 'MakeTrades надає всі необхідні інструменти для успішного старту', 'blog_post'),
  ('blog_post.cta_desc', 'zh', 'MakeTrades提供成功启动所需的所有工具', 'blog_post'),

  ('blog_post.cta_button', 'ru', 'Запросить демо', 'blog_post'),
  ('blog_post.cta_button', 'en', 'Request demo', 'blog_post'),
  ('blog_post.cta_button', 'de', 'Demo anfordern', 'blog_post'),
  ('blog_post.cta_button', 'uk', 'Запросити демо', 'blog_post'),
  ('blog_post.cta_button', 'zh', '申请演示', 'blog_post'),

  ('blog_post.related', 'ru', 'Похожие статьи', 'blog_post'),
  ('blog_post.related', 'en', 'Related articles', 'blog_post'),
  ('blog_post.related', 'de', 'Ähnliche Artikel', 'blog_post'),
  ('blog_post.related', 'uk', 'Схожі статті', 'blog_post'),
  ('blog_post.related', 'zh', '相关文章', 'blog_post'),

  ('button.blog', 'ru', 'Блог', 'navigation'),
  ('button.blog', 'en', 'Blog', 'navigation'),
  ('button.blog', 'de', 'Blog', 'navigation'),
  ('button.blog', 'uk', 'Блог', 'navigation'),
  ('button.blog', 'zh', '博客', 'navigation')

ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
