/*
  # Add detailed features, empty states, and footer label translations

  1. New Translation Keys
    - Detailed feature sections (3 blocks with titles, descriptions, and list items)
    - Empty state messages for blog and FAQ
    - Error loading messages
  
  2. Languages
    - Russian (ru), English (en), German (de), Ukrainian (uk), Chinese (zh)
*/

INSERT INTO translations (key, language, value, category) VALUES
  -- Detail section 1: Best solution
  ('detail1.title', 'ru', 'Лучшее решение для ваших клиентов', 'details'),
  ('detail1.title', 'en', 'The best solution for your clients', 'details'),
  ('detail1.title', 'de', 'Die beste Lösung für Ihre Kunden', 'details'),
  ('detail1.title', 'uk', 'Найкраще рішення для ваших клієнтів', 'details'),
  ('detail1.title', 'zh', '为您的客户提供最佳解决方案', 'details'),

  ('detail1.desc', 'ru', 'Предоставьте вашим клиентам профессиональный инструмент для трейдинга с продвинутыми функциями анализа, автоматизации и управления портфелем.', 'details'),
  ('detail1.desc', 'en', 'Provide your clients with a professional trading tool featuring advanced analysis, automation, and portfolio management capabilities.', 'details'),
  ('detail1.desc', 'de', 'Bieten Sie Ihren Kunden ein professionelles Trading-Tool mit fortschrittlichen Analyse-, Automatisierungs- und Portfoliomanagement-Funktionen.', 'details'),
  ('detail1.desc', 'uk', 'Надайте вашим клієнтам професійний інструмент для трейдингу з просунутими функціями аналізу, автоматизації та управління портфелем.', 'details'),
  ('detail1.desc', 'zh', '为您的客户提供专业的交易工具，具备先进的分析、自动化和投资组合管理功能。', 'details'),

  ('detail1.item1', 'ru', 'Интуитивно понятный интерфейс', 'details'),
  ('detail1.item1', 'en', 'Intuitive interface', 'details'),
  ('detail1.item1', 'de', 'Intuitive Benutzeroberfläche', 'details'),
  ('detail1.item1', 'uk', 'Інтуїтивно зрозумілий інтерфейс', 'details'),
  ('detail1.item1', 'zh', '直观的界面', 'details'),

  ('detail1.item2', 'ru', 'Продвинутые графики и индикаторы', 'details'),
  ('detail1.item2', 'en', 'Advanced charts and indicators', 'details'),
  ('detail1.item2', 'de', 'Erweiterte Charts und Indikatoren', 'details'),
  ('detail1.item2', 'uk', 'Просунуті графіки та індикатори', 'details'),
  ('detail1.item2', 'zh', '高级图表和指标', 'details'),

  ('detail1.item3', 'ru', 'Мобильная торговля 24/7', 'details'),
  ('detail1.item3', 'en', 'Mobile trading 24/7', 'details'),
  ('detail1.item3', 'de', 'Mobiles Trading 24/7', 'details'),
  ('detail1.item3', 'uk', 'Мобільна торгівля 24/7', 'details'),
  ('detail1.item3', 'zh', '24/7移动交易', 'details'),

  ('detail1.item4', 'ru', 'Автоматизация стратегий', 'details'),
  ('detail1.item4', 'en', 'Strategy automation', 'details'),
  ('detail1.item4', 'de', 'Strategieautomatisierung', 'details'),
  ('detail1.item4', 'uk', 'Автоматизація стратегій', 'details'),
  ('detail1.item4', 'zh', '策略自动化', 'details'),

  -- Detail section 2: Bot store
  ('detail2.title', 'ru', 'Магазин торговых ботов', 'details'),
  ('detail2.title', 'en', 'Trading Bot Store', 'details'),
  ('detail2.title', 'de', 'Trading-Bot-Store', 'details'),
  ('detail2.title', 'uk', 'Магазин торговельних ботів', 'details'),
  ('detail2.title', 'zh', '交易机器人商店', 'details'),

  ('detail2.desc', 'ru', 'Предоставьте клиентам доступ к маркетплейсу торговых ботов и позвольте разработчикам создавать собственные стратегии на JavaScript.', 'details'),
  ('detail2.desc', 'en', 'Give clients access to a trading bot marketplace and allow developers to create custom strategies in JavaScript.', 'details'),
  ('detail2.desc', 'de', 'Bieten Sie Kunden Zugang zu einem Trading-Bot-Marktplatz und ermöglichen Sie Entwicklern, eigene Strategien in JavaScript zu erstellen.', 'details'),
  ('detail2.desc', 'uk', 'Надайте клієнтам доступ до маркетплейсу торговельних ботів і дозвольте розробникам створювати власні стратегії на JavaScript.', 'details'),
  ('detail2.desc', 'zh', '为客户提供交易机器人市场访问权限，让开发者使用JavaScript创建自定义策略。', 'details'),

  ('detail2.item1', 'ru', 'Готовые торговые стратегии', 'details'),
  ('detail2.item1', 'en', 'Ready-made trading strategies', 'details'),
  ('detail2.item1', 'de', 'Fertige Handelsstrategien', 'details'),
  ('detail2.item1', 'uk', 'Готові торговельні стратегії', 'details'),
  ('detail2.item1', 'zh', '现成的交易策略', 'details'),

  ('detail2.item2', 'ru', 'Backtesting и оптимизация', 'details'),
  ('detail2.item2', 'en', 'Backtesting and optimization', 'details'),
  ('detail2.item2', 'de', 'Backtesting und Optimierung', 'details'),
  ('detail2.item2', 'uk', 'Бектестинг та оптимізація', 'details'),
  ('detail2.item2', 'zh', '回测和优化', 'details'),

  ('detail2.item3', 'ru', 'JavaScript API для разработки', 'details'),
  ('detail2.item3', 'en', 'JavaScript API for development', 'details'),
  ('detail2.item3', 'de', 'JavaScript API für Entwicklung', 'details'),
  ('detail2.item3', 'uk', 'JavaScript API для розробки', 'details'),
  ('detail2.item3', 'zh', '用于开发的JavaScript API', 'details'),

  ('detail2.item4', 'ru', 'Монетизация для разработчиков', 'details'),
  ('detail2.item4', 'en', 'Monetization for developers', 'details'),
  ('detail2.item4', 'de', 'Monetarisierung für Entwickler', 'details'),
  ('detail2.item4', 'uk', 'Монетизація для розробників', 'details'),
  ('detail2.item4', 'zh', '开发者变现', 'details'),

  -- Detail section 3: Portfolios
  ('detail3.title', 'ru', 'Инвестиционные портфели', 'details'),
  ('detail3.title', 'en', 'Investment Portfolios', 'details'),
  ('detail3.title', 'de', 'Investmentportfolios', 'details'),
  ('detail3.title', 'uk', 'Інвестиційні портфелі', 'details'),
  ('detail3.title', 'zh', '投资组合', 'details'),

  ('detail3.desc', 'ru', 'Позвольте вашим клиентам инвестировать в готовые портфели и копировать сделки успешных трейдеров.', 'details'),
  ('detail3.desc', 'en', 'Allow your clients to invest in ready-made portfolios and copy trades from successful traders.', 'details'),
  ('detail3.desc', 'de', 'Ermöglichen Sie Ihren Kunden, in fertige Portfolios zu investieren und Trades erfolgreicher Händler zu kopieren.', 'details'),
  ('detail3.desc', 'uk', 'Дозвольте вашим клієнтам інвестувати в готові портфелі та копіювати угоди успішних трейдерів.', 'details'),
  ('detail3.desc', 'zh', '允许您的客户投资现成的投资组合并复制成功交易者的交易。', 'details'),

  ('detail3.item1', 'ru', 'PAMM и MAM счета', 'details'),
  ('detail3.item1', 'en', 'PAMM and MAM accounts', 'details'),
  ('detail3.item1', 'de', 'PAMM- und MAM-Konten', 'details'),
  ('detail3.item1', 'uk', 'PAMM та MAM рахунки', 'details'),
  ('detail3.item1', 'zh', 'PAMM和MAM账户', 'details'),

  ('detail3.item2', 'ru', 'Social Trading', 'details'),
  ('detail3.item2', 'en', 'Social Trading', 'details'),
  ('detail3.item2', 'de', 'Social Trading', 'details'),
  ('detail3.item2', 'uk', 'Social Trading', 'details'),
  ('detail3.item2', 'zh', '社交交易', 'details'),

  ('detail3.item3', 'ru', 'Детальная статистика доходности', 'details'),
  ('detail3.item3', 'en', 'Detailed profitability statistics', 'details'),
  ('detail3.item3', 'de', 'Detaillierte Renditestatistiken', 'details'),
  ('detail3.item3', 'uk', 'Детальна статистика прибутковості', 'details'),
  ('detail3.item3', 'zh', '详细的盈利统计', 'details'),

  ('detail3.item4', 'ru', 'Автоматическое копирование сделок', 'details'),
  ('detail3.item4', 'en', 'Automatic trade copying', 'details'),
  ('detail3.item4', 'de', 'Automatisches Kopieren von Trades', 'details'),
  ('detail3.item4', 'uk', 'Автоматичне копіювання угод', 'details'),
  ('detail3.item4', 'zh', '自动复制交易', 'details'),

  -- Empty states
  ('blog.empty', 'ru', 'Статьи скоро появятся', 'blog'),
  ('blog.empty', 'en', 'Articles coming soon', 'blog'),
  ('blog.empty', 'de', 'Artikel erscheinen bald', 'blog'),
  ('blog.empty', 'uk', 'Статті незабаром з''являться', 'blog'),
  ('blog.empty', 'zh', '文章即将推出', 'blog'),

  ('faq.empty', 'ru', 'FAQ скоро появятся', 'faq_section'),
  ('faq.empty', 'en', 'FAQ coming soon', 'faq_section'),
  ('faq.empty', 'de', 'FAQ erscheinen bald', 'faq_section'),
  ('faq.empty', 'uk', 'FAQ незабаром з''являться', 'faq_section'),
  ('faq.empty', 'zh', 'FAQ即将推出', 'faq_section'),

  ('blog.error', 'ru', 'Ошибка загрузки статей', 'blog'),
  ('blog.error', 'en', 'Error loading articles', 'blog'),
  ('blog.error', 'de', 'Fehler beim Laden der Artikel', 'blog'),
  ('blog.error', 'uk', 'Помилка завантаження статей', 'blog'),
  ('blog.error', 'zh', '加载文章时出错', 'blog'),

  ('faq.error', 'ru', 'Ошибка загрузки FAQ', 'faq_section'),
  ('faq.error', 'en', 'Error loading FAQ', 'faq_section'),
  ('faq.error', 'de', 'Fehler beim Laden der FAQ', 'faq_section'),
  ('faq.error', 'uk', 'Помилка завантаження FAQ', 'faq_section'),
  ('faq.error', 'zh', '加载FAQ时出错', 'faq_section'),

  -- Footer labels (address, phone, email may not exist yet)
  ('footer.address', 'ru', 'Адрес', 'footer'),
  ('footer.address', 'en', 'Address', 'footer'),
  ('footer.address', 'uk', 'Адреса', 'footer'),
  ('footer.address', 'zh', '地址', 'footer'),

  ('footer.phone', 'ru', 'Телефон', 'footer'),
  ('footer.phone', 'en', 'Phone', 'footer'),
  ('footer.phone', 'uk', 'Телефон', 'footer'),
  ('footer.phone', 'zh', '电话', 'footer'),

  ('footer.email_label', 'ru', 'Email', 'footer'),
  ('footer.email_label', 'en', 'Email', 'footer'),
  ('footer.email_label', 'uk', 'Email', 'footer'),
  ('footer.email_label', 'zh', '邮箱', 'footer'),

  ('footer.tagline', 'ru', 'Создание брокеров, криптобирж и дилинговых центров под ключ', 'footer'),
  ('footer.tagline', 'en', 'Turnkey creation of brokers, crypto exchanges and dealing centers', 'footer'),
  ('footer.tagline', 'uk', 'Створення брокерів, криптобірж та дилінгових центрів під ключ', 'footer'),
  ('footer.tagline', 'zh', '一站式创建经纪商、加密交易所和交易中心', 'footer')

ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
