/*
  # Add FAQ and Blog page-specific translations

  1. New Translation Keys
    - FAQ page: title, subtitle, category buttons, CTA section, loading/empty states
    - Blog page: title, subtitle, category filters, loading/empty states, reading time
    - Shared: "Back to home" button, copyright text for subpages
  
  2. Languages
    - Russian (ru), English (en), German (de), Ukrainian (uk), Chinese (zh)
*/

INSERT INTO translations (key, language, value, category) VALUES
  -- FAQ page
  ('faq_page.title', 'ru', 'Часто задаваемые вопросы', 'faq_page'),
  ('faq_page.title', 'en', 'Frequently Asked Questions', 'faq_page'),
  ('faq_page.title', 'de', 'Häufig gestellte Fragen', 'faq_page'),
  ('faq_page.title', 'uk', 'Часті запитання', 'faq_page'),
  ('faq_page.title', 'zh', '常见问题', 'faq_page'),

  ('faq_page.subtitle', 'ru', 'Найдите ответы на самые популярные вопросы о платформе MakeTrades', 'faq_page'),
  ('faq_page.subtitle', 'en', 'Find answers to the most popular questions about the MakeTrades platform', 'faq_page'),
  ('faq_page.subtitle', 'de', 'Finden Sie Antworten auf die häufigsten Fragen zur MakeTrades-Plattform', 'faq_page'),
  ('faq_page.subtitle', 'uk', 'Знайдіть відповіді на найпопулярніші запитання про платформу MakeTrades', 'faq_page'),
  ('faq_page.subtitle', 'zh', '查找关于MakeTrades平台最常见问题的答案', 'faq_page'),

  ('faq_page.cat_all', 'ru', 'Все вопросы', 'faq_page'),
  ('faq_page.cat_all', 'en', 'All questions', 'faq_page'),
  ('faq_page.cat_all', 'de', 'Alle Fragen', 'faq_page'),
  ('faq_page.cat_all', 'uk', 'Усі запитання', 'faq_page'),
  ('faq_page.cat_all', 'zh', '所有问题', 'faq_page'),

  ('faq_page.cat_pricing', 'ru', 'Цены', 'faq_page'),
  ('faq_page.cat_pricing', 'en', 'Pricing', 'faq_page'),
  ('faq_page.cat_pricing', 'de', 'Preise', 'faq_page'),
  ('faq_page.cat_pricing', 'uk', 'Ціни', 'faq_page'),
  ('faq_page.cat_pricing', 'zh', '价格', 'faq_page'),

  ('faq_page.cat_features', 'ru', 'Возможности', 'faq_page'),
  ('faq_page.cat_features', 'en', 'Features', 'faq_page'),
  ('faq_page.cat_features', 'de', 'Funktionen', 'faq_page'),
  ('faq_page.cat_features', 'uk', 'Можливості', 'faq_page'),
  ('faq_page.cat_features', 'zh', '功能', 'faq_page'),

  ('faq_page.cat_support', 'ru', 'Поддержка', 'faq_page'),
  ('faq_page.cat_support', 'en', 'Support', 'faq_page'),
  ('faq_page.cat_support', 'de', 'Support', 'faq_page'),
  ('faq_page.cat_support', 'uk', 'Підтримка', 'faq_page'),
  ('faq_page.cat_support', 'zh', '支持', 'faq_page'),

  ('faq_page.cta_title', 'ru', 'Не нашли ответ?', 'faq_page'),
  ('faq_page.cta_title', 'en', 'Didn''t find an answer?', 'faq_page'),
  ('faq_page.cta_title', 'de', 'Keine Antwort gefunden?', 'faq_page'),
  ('faq_page.cta_title', 'uk', 'Не знайшли відповідь?', 'faq_page'),
  ('faq_page.cta_title', 'zh', '没有找到答案？', 'faq_page'),

  ('faq_page.cta_desc', 'ru', 'Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы', 'faq_page'),
  ('faq_page.cta_desc', 'en', 'Contact us and we will be happy to answer all your questions', 'faq_page'),
  ('faq_page.cta_desc', 'de', 'Kontaktieren Sie uns und wir beantworten gerne alle Ihre Fragen', 'faq_page'),
  ('faq_page.cta_desc', 'uk', 'Зв''яжіться з нами, і ми з радістю відповімо на всі ваші запитання', 'faq_page'),
  ('faq_page.cta_desc', 'zh', '联系我们，我们将很乐意回答您的所有问题', 'faq_page'),

  ('faq_page.cta_button', 'ru', 'Связаться с нами', 'faq_page'),
  ('faq_page.cta_button', 'en', 'Contact us', 'faq_page'),
  ('faq_page.cta_button', 'de', 'Kontaktieren Sie uns', 'faq_page'),
  ('faq_page.cta_button', 'uk', 'Зв''язатися з нами', 'faq_page'),
  ('faq_page.cta_button', 'zh', '联系我们', 'faq_page'),

  ('faq_page.loading', 'ru', 'Загрузка вопросов...', 'faq_page'),
  ('faq_page.loading', 'en', 'Loading questions...', 'faq_page'),
  ('faq_page.loading', 'de', 'Fragen werden geladen...', 'faq_page'),
  ('faq_page.loading', 'uk', 'Завантаження запитань...', 'faq_page'),
  ('faq_page.loading', 'zh', '加载问题中...', 'faq_page'),

  ('faq_page.empty', 'ru', 'Вопросы скоро появятся', 'faq_page'),
  ('faq_page.empty', 'en', 'Questions coming soon', 'faq_page'),
  ('faq_page.empty', 'de', 'Fragen erscheinen bald', 'faq_page'),
  ('faq_page.empty', 'uk', 'Запитання незабаром з''являться', 'faq_page'),
  ('faq_page.empty', 'zh', '问题即将推出', 'faq_page'),

  -- Blog page
  ('blog_page.title', 'ru', 'Блог MakeTrades', 'blog_page'),
  ('blog_page.title', 'en', 'MakeTrades Blog', 'blog_page'),
  ('blog_page.title', 'de', 'MakeTrades Blog', 'blog_page'),
  ('blog_page.title', 'uk', 'Блог MakeTrades', 'blog_page'),
  ('blog_page.title', 'zh', 'MakeTrades博客', 'blog_page'),

  ('blog_page.subtitle', 'ru', 'Полезные статьи о создании брокерской компании, торговых стратегиях и управлении финансовыми платформами', 'blog_page'),
  ('blog_page.subtitle', 'en', 'Useful articles about creating a brokerage company, trading strategies and managing financial platforms', 'blog_page'),
  ('blog_page.subtitle', 'de', 'Nützliche Artikel über die Gründung eines Brokerunternehmens, Handelsstrategien und das Management von Finanzplattformen', 'blog_page'),
  ('blog_page.subtitle', 'uk', 'Корисні статті про створення брокерської компанії, торговельні стратегії та управління фінансовими платформами', 'blog_page'),
  ('blog_page.subtitle', 'zh', '关于创建经纪公司、交易策略和管理金融平台的有用文章', 'blog_page'),

  ('blog_page.cat_all', 'ru', 'Все статьи', 'blog_page'),
  ('blog_page.cat_all', 'en', 'All articles', 'blog_page'),
  ('blog_page.cat_all', 'de', 'Alle Artikel', 'blog_page'),
  ('blog_page.cat_all', 'uk', 'Усі статті', 'blog_page'),
  ('blog_page.cat_all', 'zh', '所有文章', 'blog_page'),

  ('blog_page.cat_brokers', 'ru', 'Брокеры', 'blog_page'),
  ('blog_page.cat_brokers', 'en', 'Brokers', 'blog_page'),
  ('blog_page.cat_brokers', 'de', 'Broker', 'blog_page'),
  ('blog_page.cat_brokers', 'uk', 'Брокери', 'blog_page'),
  ('blog_page.cat_brokers', 'zh', '经纪商', 'blog_page'),

  ('blog_page.cat_trading', 'ru', 'Трейдинг', 'blog_page'),
  ('blog_page.cat_trading', 'en', 'Trading', 'blog_page'),
  ('blog_page.cat_trading', 'de', 'Trading', 'blog_page'),
  ('blog_page.cat_trading', 'uk', 'Трейдинг', 'blog_page'),
  ('blog_page.cat_trading', 'zh', '交易', 'blog_page'),

  ('blog_page.cat_tech', 'ru', 'Технологии', 'blog_page'),
  ('blog_page.cat_tech', 'en', 'Technology', 'blog_page'),
  ('blog_page.cat_tech', 'de', 'Technologie', 'blog_page'),
  ('blog_page.cat_tech', 'uk', 'Технології', 'blog_page'),
  ('blog_page.cat_tech', 'zh', '技术', 'blog_page'),

  ('blog_page.cat_strategies', 'ru', 'Стратегии', 'blog_page'),
  ('blog_page.cat_strategies', 'en', 'Strategies', 'blog_page'),
  ('blog_page.cat_strategies', 'de', 'Strategien', 'blog_page'),
  ('blog_page.cat_strategies', 'uk', 'Стратегії', 'blog_page'),
  ('blog_page.cat_strategies', 'zh', '策略', 'blog_page'),

  ('blog_page.cat_regulation', 'ru', 'Регуляция', 'blog_page'),
  ('blog_page.cat_regulation', 'en', 'Regulation', 'blog_page'),
  ('blog_page.cat_regulation', 'de', 'Regulierung', 'blog_page'),
  ('blog_page.cat_regulation', 'uk', 'Регуляція', 'blog_page'),
  ('blog_page.cat_regulation', 'zh', '监管', 'blog_page'),

  ('blog_page.cat_marketing', 'ru', 'Маркетинг', 'blog_page'),
  ('blog_page.cat_marketing', 'en', 'Marketing', 'blog_page'),
  ('blog_page.cat_marketing', 'de', 'Marketing', 'blog_page'),
  ('blog_page.cat_marketing', 'uk', 'Маркетинг', 'blog_page'),
  ('blog_page.cat_marketing', 'zh', '营销', 'blog_page'),

  ('blog_page.loading', 'ru', 'Загрузка статей...', 'blog_page'),
  ('blog_page.loading', 'en', 'Loading articles...', 'blog_page'),
  ('blog_page.loading', 'de', 'Artikel werden geladen...', 'blog_page'),
  ('blog_page.loading', 'uk', 'Завантаження статей...', 'blog_page'),
  ('blog_page.loading', 'zh', '加载文章中...', 'blog_page'),

  ('blog_page.empty', 'ru', 'Статьи скоро появятся', 'blog_page'),
  ('blog_page.empty', 'en', 'Articles coming soon', 'blog_page'),
  ('blog_page.empty', 'de', 'Artikel erscheinen bald', 'blog_page'),
  ('blog_page.empty', 'uk', 'Статті незабаром з''являться', 'blog_page'),
  ('blog_page.empty', 'zh', '文章即将推出', 'blog_page'),

  ('blog_page.min_read', 'ru', 'мин', 'blog_page'),
  ('blog_page.min_read', 'en', 'min', 'blog_page'),
  ('blog_page.min_read', 'de', 'Min', 'blog_page'),
  ('blog_page.min_read', 'uk', 'хв', 'blog_page'),
  ('blog_page.min_read', 'zh', '分钟', 'blog_page'),

  -- Shared: back to home button
  ('button.back_home', 'ru', 'На главную', 'navigation'),
  ('button.back_home', 'en', 'Home', 'navigation'),
  ('button.back_home', 'de', 'Startseite', 'navigation'),
  ('button.back_home', 'uk', 'На головну', 'navigation'),
  ('button.back_home', 'zh', '首页', 'navigation')

ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
