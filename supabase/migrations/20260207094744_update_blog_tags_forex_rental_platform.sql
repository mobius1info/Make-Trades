/*
  # Update Blog Post Tags for Forex Platform Rental Theme

  This migration updates all blog post tags to be more relevant to the Forex platform rental and brokerage technology theme.
  
  Tags will include topics like:
  - Platform rental (аренда платформы)
  - Trading platforms (MetaTrader, cTrader)
  - White label solutions
  - Brokerage technology
  - CRM systems
  - Liquidity bridges
  - Regulation and licensing
  - Risk management systems
  - And many other relevant topics
*/

-- Update tags for Russian articles with diverse Forex rental platform themes
UPDATE blog_posts SET tags = ARRAY['стратегии', 'начинающим', 'торговая платформа', 'аренда MT4'] WHERE slug = 'article-1-ru';
UPDATE blog_posts SET tags = ARRAY['технический анализ', 'графики', 'индикаторы', 'платформа для анализа'] WHERE slug = 'article-3-ru';
UPDATE blog_posts SET tags = ARRAY['управление рисками', 'риск-менеджмент', 'безопасность', 'защита капитала'] WHERE slug = 'article-4-ru';
UPDATE blog_posts SET tags = ARRAY['криптовалюты', 'цифровые активы', 'крипто-платформа', 'блокчейн торговля'] WHERE slug = 'article-5-ru';
UPDATE blog_posts SET tags = ARRAY['психология трейдинга', 'эмоции', 'дисциплина', 'торговая психология'] WHERE slug = 'article-6-ru';
UPDATE blog_posts SET tags = ARRAY['фундаментальный анализ', 'экономика', 'новости', 'макроэкономика'] WHERE slug = 'article-8-ru';
UPDATE blog_posts SET tags = ARRAY['автоматическая торговля', 'роботы', 'алготрейдинг', 'EA'] WHERE slug = 'article-9-ru';
UPDATE blog_posts SET tags = ARRAY['форекс', 'криптовалюты', 'сравнение платформ', 'выбор брокера'] WHERE slug = 'article-10-ru';

-- Update remaining articles with generic tags
UPDATE blog_posts SET tags = ARRAY['аренда форекс платформы', 'MetaTrader 4', 'белая метка', 'брокерская технология'] 
WHERE tags = ARRAY['trading', 'forex'] AND language = 'ru' AND slug NOT IN ('article-1-ru', 'article-3-ru', 'article-4-ru', 'article-5-ru', 'article-6-ru', 'article-8-ru', 'article-9-ru', 'article-10-ru');

-- Update English articles
UPDATE blog_posts SET tags = ARRAY['forex platform rental', 'MetaTrader 5', 'white label', 'brokerage technology'] 
WHERE tags = ARRAY['trading', 'forex'] AND language = 'en';

-- Update German articles
UPDATE blog_posts SET tags = ARRAY['Forex-Plattform-Vermietung', 'Handelsplattform', 'White-Label', 'Broker-Technologie'] 
WHERE tags = ARRAY['trading', 'forex'] AND language = 'de';

-- Update Ukrainian articles
UPDATE blog_posts SET tags = ARRAY['оренда форекс платформи', 'торгова платформа', 'біла мітка', 'брокерські технології'] 
WHERE tags = ARRAY['trading', 'forex'] AND language = 'uk';

-- Update Chinese articles
UPDATE blog_posts SET tags = ARRAY['外汇平台租赁', '交易平台', '白标', '经纪技术'] 
WHERE tags = ARRAY['trading', 'forex'] AND language = 'zh';