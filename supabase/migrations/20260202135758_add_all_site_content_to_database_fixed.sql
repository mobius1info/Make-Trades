/*
  # Add All Site Content to Database

  1. New Data
    - Add all site texts to translations table
    - Add all site images to site_images table

  2. Categories
    - hero: Hero section texts
    - features: Feature cards and descriptions
    - detailed_features: Detailed feature sections
    - footer: Footer texts
    - forms: Form labels and placeholders
    - buttons: Button texts
    - cta: Call-to-action texts
    - blog: Blog section texts
    - faq_section: FAQ section texts
*/

-- Add hero section translations
INSERT INTO translations (key, language, value, category) VALUES
  -- Hero titles
  ('hero.title', 'ru', 'Лучшее решение для создания брокера', 'hero'),
  ('hero.title', 'en', 'Best Solution for Creating a Broker', 'hero'),
  ('hero.title', 'de', 'Beste Lösung für die Erstellung eines Brokers', 'hero'),
  ('hero.title', 'uk', 'Найкраще рішення для створення брокера', 'hero'),
  ('hero.title', 'zh', '创建经纪商的最佳解决方案', 'hero'),
  
  -- Hero subtitles
  ('hero.subtitle', 'ru', 'Создание Брокеров, Криптобирж и Дилинговых Центров под ключ с MakeTrades', 'hero'),
  ('hero.subtitle', 'en', 'Turnkey Creation of Brokers, Crypto Exchanges, and Dealing Centers with MakeTrades', 'hero'),
  ('hero.subtitle', 'de', 'Schlüsselfertige Erstellung von Brokern, Krypto-Börsen und Handelszentren mit MakeTrades', 'hero'),
  ('hero.subtitle', 'uk', 'Створення Брокерів, Криптобірж та Дилінгових Центрів під ключ з MakeTrades', 'hero'),
  ('hero.subtitle', 'zh', '使用 MakeTrades 一站式创建经纪商、加密货币交易所和交易中心', 'hero'),
  
  -- Hero badges
  ('hero.badge_1', 'ru', '500+ торговых инструментов', 'hero'),
  ('hero.badge_1', 'en', '500+ trading instruments', 'hero'),
  ('hero.badge_1', 'de', '500+ Handelsinstrumente', 'hero'),
  ('hero.badge_1', 'uk', '500+ торгових інструментів', 'hero'),
  ('hero.badge_1', 'zh', '500+ 交易工具', 'hero'),
  
  ('hero.badge_2', 'ru', '200+ компаний используют', 'hero'),
  ('hero.badge_2', 'en', '200+ companies use', 'hero'),
  ('hero.badge_2', 'de', '200+ Unternehmen nutzen', 'hero'),
  ('hero.badge_2', 'uk', '200+ компаній використовують', 'hero'),
  ('hero.badge_2', 'zh', '200+ 公司使用', 'hero'),
  
  ('hero.badge_3', 'ru', 'White Label решение', 'hero'),
  ('hero.badge_3', 'en', 'White Label solution', 'hero'),
  ('hero.badge_3', 'de', 'White-Label-Lösung', 'hero'),
  ('hero.badge_3', 'uk', 'White Label рішення', 'hero'),
  ('hero.badge_3', 'zh', '白标解决方案', 'hero'),

  -- Section titles
  ('section.features_title', 'ru', 'Полный функционал для вашего брокера', 'features'),
  ('section.features_title', 'en', 'Complete Functionality for Your Broker', 'features'),
  ('section.features_title', 'de', 'Vollständige Funktionalität für Ihren Broker', 'features'),
  ('section.features_title', 'uk', 'Повний функціонал для вашого брокера', 'features'),
  ('section.features_title', 'zh', '为您的经纪商提供完整功能', 'features'),
  
  ('section.blog_title', 'ru', 'Полезные статьи', 'blog'),
  ('section.blog_title', 'en', 'Useful Articles', 'blog'),
  ('section.blog_title', 'de', 'Nützliche Artikel', 'blog'),
  ('section.blog_title', 'uk', 'Корисні статті', 'blog'),
  ('section.blog_title', 'zh', '有用的文章', 'blog'),
  
  ('section.faq_title', 'ru', 'Часто задаваемые вопросы', 'faq_section'),
  ('section.faq_title', 'en', 'Frequently Asked Questions', 'faq_section'),
  ('section.faq_title', 'de', 'Häufig gestellte Fragen', 'faq_section'),
  ('section.faq_title', 'uk', 'Часті питання', 'faq_section'),
  ('section.faq_title', 'zh', '常见问题', 'faq_section'),

  -- Feature cards
  ('feature.terminals.title', 'ru', 'Все торговые терминалы', 'features'),
  ('feature.terminals.title', 'en', 'All Trading Terminals', 'features'),
  ('feature.terminals.title', 'de', 'Alle Handelsplattformen', 'features'),
  ('feature.terminals.title', 'uk', 'Всі торгові термінали', 'features'),
  ('feature.terminals.title', 'zh', '所有交易终端', 'features'),
  
  ('feature.terminals.desc', 'ru', 'Виджеты, сервер, котировки, CRM, кабинет трейдера - всё включено в одну платформу', 'features'),
  ('feature.terminals.desc', 'en', 'Widgets, server, quotes, CRM, trader cabinet - everything in one platform', 'features'),
  ('feature.terminals.desc', 'de', 'Widgets, Server, Kurse, CRM, Händlerkabinett - alles in einer Plattform', 'features'),
  ('feature.terminals.desc', 'uk', 'Віджети, сервер, котирування, CRM, кабінет трейдера - все в одній платформі', 'features'),
  ('feature.terminals.desc', 'zh', '小部件、服务器、报价、CRM、交易员办公室 - 一切尽在一个平台', 'features'),

  ('feature.apps.title', 'ru', 'Приложения в сторах', 'features'),
  ('feature.apps.title', 'en', 'Store Applications', 'features'),
  ('feature.apps.title', 'de', 'Store-Anwendungen', 'features'),
  ('feature.apps.title', 'uk', 'Додатки в сторах', 'features'),
  ('feature.apps.title', 'zh', '应用商店', 'features'),
  
  ('feature.apps.desc', 'ru', 'Регистрация приложения с вашим логотипом в Apple Store и Google Play', 'features'),
  ('feature.apps.desc', 'en', 'App registration with your logo in Apple Store and Google Play', 'features'),
  ('feature.apps.desc', 'de', 'App-Registrierung mit Ihrem Logo im Apple Store und Google Play', 'features'),
  ('feature.apps.desc', 'uk', 'Реєстрація додатку з вашим логотипом в Apple Store та Google Play', 'features'),
  ('feature.apps.desc', 'zh', '在 Apple Store 和 Google Play 中使用您的徽标注册应用程序', 'features'),

  ('feature.instruments.title', 'ru', '500+ инструментов', 'features'),
  ('feature.instruments.title', 'en', '500+ Instruments', 'features'),
  ('feature.instruments.title', 'de', '500+ Instrumente', 'features'),
  ('feature.instruments.title', 'uk', '500+ інструментів', 'features'),
  ('feature.instruments.title', 'zh', '500+ 工具', 'features'),
  
  ('feature.instruments.desc', 'ru', 'Котировки forex, криптовалют, акций и индексов в реальном времени', 'features'),
  ('feature.instruments.desc', 'en', 'Real-time quotes for forex, crypto, stocks and indices', 'features'),
  ('feature.instruments.desc', 'de', 'Echtzeit-Kurse für Forex, Krypto, Aktien und Indizes', 'features'),
  ('feature.instruments.desc', 'uk', 'Котирування forex, криптовалют, акцій та індексів у реальному часі', 'features'),
  ('feature.instruments.desc', 'zh', '外汇、加密货币、股票和指数的实时报价', 'features'),

  ('feature.settings.title', 'ru', 'Гибкие настройки', 'features'),
  ('feature.settings.title', 'en', 'Flexible Settings', 'features'),
  ('feature.settings.title', 'de', 'Flexible Einstellungen', 'features'),
  ('feature.settings.title', 'uk', 'Гнучкі налаштування', 'features'),
  ('feature.settings.title', 'zh', '灵活设置', 'features'),
  
  ('feature.settings.desc', 'ru', 'Настраиваемые спреды, комиссии и параметры для каждого инструмента', 'features'),
  ('feature.settings.desc', 'en', 'Customizable spreads, commissions and parameters for each instrument', 'features'),
  ('feature.settings.desc', 'de', 'Anpassbare Spreads, Provisionen und Parameter für jedes Instrument', 'features'),
  ('feature.settings.desc', 'uk', 'Налаштовувані спреди, комісії та параметри для кожного інструменту', 'features'),
  ('feature.settings.desc', 'zh', '每个工具的可定制点差、佣金和参数', 'features'),

  ('feature.investments.title', 'ru', 'Инвестиции и копирование', 'features'),
  ('feature.investments.title', 'en', 'Investments and Copy Trading', 'features'),
  ('feature.investments.title', 'de', 'Investitionen und Copy Trading', 'features'),
  ('feature.investments.title', 'uk', 'Інвестиції та копіювання', 'features'),
  ('feature.investments.title', 'zh', '投资和跟单交易', 'features'),
  
  ('feature.investments.desc', 'ru', 'Самый функциональный терминал с инвестициями и копированием сделок', 'features'),
  ('feature.investments.desc', 'en', 'The most functional terminal with investments and copy trading', 'features'),
  ('feature.investments.desc', 'de', 'Das funktionalste Terminal mit Investitionen und Copy Trading', 'features'),
  ('feature.investments.desc', 'uk', 'Найфункціональніший термінал з інвестиціями та копіюванням угод', 'features'),
  ('feature.investments.desc', 'zh', '具有投资和跟单交易功能的最全功能终端', 'features'),

  ('feature.prop.title', 'ru', 'Prop-trading и бинарные опционы', 'features'),
  ('feature.prop.title', 'en', 'Prop-trading and Binary Options', 'features'),
  ('feature.prop.title', 'de', 'Prop-Trading und Binäroptionen', 'features'),
  ('feature.prop.title', 'uk', 'Prop-trading та бінарні опціони', 'features'),
  ('feature.prop.title', 'zh', 'Prop交易和二元期权', 'features'),
  
  ('feature.prop.desc', 'ru', 'Возможность интеграции prop-trading и бинарных опционов', 'features'),
  ('feature.prop.desc', 'en', 'Integration of prop-trading and binary options', 'features'),
  ('feature.prop.desc', 'de', 'Integration von Prop-Trading und Binäroptionen', 'features'),
  ('feature.prop.desc', 'uk', 'Можливість інтеграції prop-trading та бінарних опціонів', 'features'),
  ('feature.prop.desc', 'zh', '集成prop交易和二元期权', 'features'),

  ('feature.store.title', 'ru', 'Store ботов и индикаторов', 'features'),
  ('feature.store.title', 'en', 'Bot and Indicator Store', 'features'),
  ('feature.store.title', 'de', 'Bot- und Indikator-Store', 'features'),
  ('feature.store.title', 'uk', 'Store ботів та індикаторів', 'features'),
  ('feature.store.title', 'zh', '机器人和指标商店', 'features'),
  
  ('feature.store.desc', 'ru', 'Магазин ботов и индикаторов с поддержкой JavaScript разработки', 'features'),
  ('feature.store.desc', 'en', 'Bot and indicator marketplace with JavaScript development support', 'features'),
  ('feature.store.desc', 'de', 'Bot- und Indikator-Marktplatz mit JavaScript-Entwicklungsunterstützung', 'features'),
  ('feature.store.desc', 'uk', 'Магазин ботів та індикаторів з підтримкою JavaScript розробки', 'features'),
  ('feature.store.desc', 'zh', '支持JavaScript开发的机器人和指标市场', 'features'),

  ('feature.crypto.title', 'ru', 'Криптовалютный процессинг', 'features'),
  ('feature.crypto.title', 'en', 'Crypto Processing', 'features'),
  ('feature.crypto.title', 'de', 'Krypto-Verarbeitung', 'features'),
  ('feature.crypto.title', 'uk', 'Криптовалютний процесінг', 'features'),
  ('feature.crypto.title', 'zh', '加密货币处理', 'features'),
  
  ('feature.crypto.desc', 'ru', 'Встроенный процессинг для приема и вывода криптовалюты', 'features'),
  ('feature.crypto.desc', 'en', 'Built-in processing for cryptocurrency deposits and withdrawals', 'features'),
  ('feature.crypto.desc', 'de', 'Integrierte Verarbeitung für Kryptowährungseinzahlungen und -abhebungen', 'features'),
  ('feature.crypto.desc', 'uk', 'Вбудований процесінг для прийому та виводу криптовалюти', 'features'),
  ('feature.crypto.desc', 'zh', '内置加密货币存款和取款处理', 'features'),

  ('feature.api.title', 'ru', 'API интеграции', 'features'),
  ('feature.api.title', 'en', 'API Integrations', 'features'),
  ('feature.api.title', 'de', 'API-Integrationen', 'features'),
  ('feature.api.title', 'uk', 'API інтеграції', 'features'),
  ('feature.api.title', 'zh', 'API集成', 'features'),
  
  ('feature.api.desc', 'ru', 'API для интеграции платежных систем и сторонних сервисов', 'features'),
  ('feature.api.desc', 'en', 'API for payment systems and third-party service integration', 'features'),
  ('feature.api.desc', 'de', 'API für Zahlungssysteme und Drittanbieter-Service-Integration', 'features'),
  ('feature.api.desc', 'uk', 'API для інтеграції платіжних систем та сторонніх сервісів', 'features'),
  ('feature.api.desc', 'zh', '用于支付系统和第三方服务集成的API', 'features'),

  ('feature.companies.title', 'ru', '200+ компаний', 'features'),
  ('feature.companies.title', 'en', '200+ Companies', 'features'),
  ('feature.companies.title', 'de', '200+ Unternehmen', 'features'),
  ('feature.companies.title', 'uk', '200+ компаній', 'features'),
  ('feature.companies.title', 'zh', '200+ 公司', 'features'),
  
  ('feature.companies.desc', 'ru', 'Более 200 компаний по всему миру используют нашу платформу', 'features'),
  ('feature.companies.desc', 'en', 'Over 200 companies worldwide use our platform', 'features'),
  ('feature.companies.desc', 'de', 'Über 200 Unternehmen weltweit nutzen unsere Plattform', 'features'),
  ('feature.companies.desc', 'uk', 'Понад 200 компаній у всьому світі використовують нашу платформу', 'features'),
  ('feature.companies.desc', 'zh', '全球超过200家公司使用我们的平台', 'features'),

  ('feature.crm.title', 'ru', 'Полнофункциональная CRM', 'features'),
  ('feature.crm.title', 'en', 'Full-Featured CRM', 'features'),
  ('feature.crm.title', 'de', 'Voll funktionsfähiges CRM', 'features'),
  ('feature.crm.title', 'uk', 'Повнофункціональна CRM', 'features'),
  ('feature.crm.title', 'zh', '全功能CRM', 'features'),
  
  ('feature.crm.desc', 'ru', 'CRM с разделением ролей, управлением лидами и автоматизацией', 'features'),
  ('feature.crm.desc', 'en', 'CRM with role separation, lead management and automation', 'features'),
  ('feature.crm.desc', 'de', 'CRM mit Rollentrennung, Lead-Management und Automatisierung', 'features'),
  ('feature.crm.desc', 'uk', 'CRM з розподілом ролей, управлінням лідами та автоматизацією', 'features'),
  ('feature.crm.desc', 'zh', '具有角色分离、潜在客户管理和自动化功能的CRM', 'features'),

  ('feature.partner.title', 'ru', 'Партнерская программа', 'features'),
  ('feature.partner.title', 'en', 'Partner Program', 'features'),
  ('feature.partner.title', 'de', 'Partnerprogramm', 'features'),
  ('feature.partner.title', 'uk', 'Партнерська програма', 'features'),
  ('feature.partner.title', 'zh', '合作伙伴计划', 'features'),
  
  ('feature.partner.desc', 'ru', 'Автоматическое распределение бонусов и партнерских комиссий, IB-кабинет', 'features'),
  ('feature.partner.desc', 'en', 'Automatic distribution of bonuses and partner commissions, IB cabinet', 'features'),
  ('feature.partner.desc', 'de', 'Automatische Verteilung von Boni und Partnerprovisionen, IB-Kabinett', 'features'),
  ('feature.partner.desc', 'uk', 'Автоматичний розподіл бонусів та партнерських комісій, IB-кабінет', 'features'),
  ('feature.partner.desc', 'zh', '自动分配奖金和合作伙伴佣金，IB办公室', 'features'),

  -- CTA section
  ('cta.title', 'ru', 'Готовы начать?', 'cta'),
  ('cta.title', 'en', 'Ready to Start?', 'cta'),
  ('cta.title', 'de', 'Bereit anzufangen?', 'cta'),
  ('cta.title', 'uk', 'Готові почати?', 'cta'),
  ('cta.title', 'zh', '准备开始了吗？', 'cta'),
  
  ('cta.description', 'ru', 'Получите демо-аккаунт и протестируйте все возможности платформы бесплатно', 'cta'),
  ('cta.description', 'en', 'Get a demo account and test all platform features for free', 'cta'),
  ('cta.description', 'de', 'Erhalten Sie ein Demo-Konto und testen Sie alle Plattformfunktionen kostenlos', 'cta'),
  ('cta.description', 'uk', 'Отримайте демо-акаунт та протестуйте всі можливості платформи безкоштовно', 'cta'),
  ('cta.description', 'zh', '获取演示账户，免费测试平台的所有功能', 'cta'),

  -- Footer
  ('footer.company_desc', 'ru', 'Создание брокеров, криптобирж и дилинговых центров под ключ', 'footer'),
  ('footer.company_desc', 'en', 'Turnkey creation of brokers, crypto exchanges and dealing centers', 'footer'),
  ('footer.company_desc', 'de', 'Schlüsselfertige Erstellung von Brokern, Krypto-Börsen und Handelszentren', 'footer'),
  ('footer.company_desc', 'uk', 'Створення брокерів, криптобірж та дилінгових центрів під ключ', 'footer'),
  ('footer.company_desc', 'zh', '一站式创建经纪商、加密货币交易所和交易中心', 'footer'),

  ('footer.navigation', 'ru', 'Навигация', 'footer'),
  ('footer.navigation', 'en', 'Navigation', 'footer'),
  ('footer.navigation', 'de', 'Navigation', 'footer'),
  ('footer.navigation', 'uk', 'Навігація', 'footer'),
  ('footer.navigation', 'zh', '导航', 'footer'),

  ('footer.contacts', 'ru', 'Контакты', 'footer'),
  ('footer.contacts', 'en', 'Contacts', 'footer'),
  ('footer.contacts', 'de', 'Kontakte', 'footer'),
  ('footer.contacts', 'uk', 'Контакти', 'footer'),
  ('footer.contacts', 'zh', '联系方式', 'footer'),

  ('footer.feedback', 'ru', 'Обратная связь', 'footer'),
  ('footer.feedback', 'en', 'Feedback', 'footer'),
  ('footer.feedback', 'de', 'Rückmeldung', 'footer'),
  ('footer.feedback', 'uk', 'Зворотній зв''язок', 'footer'),
  ('footer.feedback', 'zh', '反馈', 'footer'),

  ('footer.copyright', 'ru', '© 2024 MakeTrades. Все права защищены.', 'footer'),
  ('footer.copyright', 'en', '© 2024 MakeTrades. All rights reserved.', 'footer'),
  ('footer.copyright', 'de', '© 2024 MakeTrades. Alle Rechte vorbehalten.', 'footer'),
  ('footer.copyright', 'uk', '© 2024 MakeTrades. Всі права захищені.', 'footer'),
  ('footer.copyright', 'zh', '© 2024 MakeTrades. 版权所有。', 'footer'),

  -- Navigation
  ('nav.home', 'ru', 'Главная', 'navigation'),
  ('nav.home', 'en', 'Home', 'navigation'),
  ('nav.home', 'de', 'Startseite', 'navigation'),
  ('nav.home', 'uk', 'Головна', 'navigation'),
  ('nav.home', 'zh', '主页', 'navigation'),

  ('nav.features', 'ru', 'Возможности', 'navigation'),
  ('nav.features', 'en', 'Features', 'navigation'),
  ('nav.features', 'de', 'Funktionen', 'navigation'),
  ('nav.features', 'uk', 'Можливості', 'navigation'),
  ('nav.features', 'zh', '功能', 'navigation'),

  ('nav.blog', 'ru', 'Блог', 'navigation'),
  ('nav.blog', 'en', 'Blog', 'navigation'),
  ('nav.blog', 'de', 'Blog', 'navigation'),
  ('nav.blog', 'uk', 'Блог', 'navigation'),
  ('nav.blog', 'zh', '博客', 'navigation'),

  ('nav.faq', 'ru', 'FAQ', 'navigation'),
  ('nav.faq', 'en', 'FAQ', 'navigation'),
  ('nav.faq', 'de', 'FAQ', 'navigation'),
  ('nav.faq', 'uk', 'FAQ', 'navigation'),
  ('nav.faq', 'zh', '常见问题', 'navigation'),

  ('nav.contact', 'ru', 'Контакты', 'navigation'),
  ('nav.contact', 'en', 'Contact', 'navigation'),
  ('nav.contact', 'de', 'Kontakt', 'navigation'),
  ('nav.contact', 'uk', 'Контакти', 'navigation'),
  ('nav.contact', 'zh', '联系', 'navigation'),

  -- Forms
  ('form.name', 'ru', 'Ваше имя', 'forms'),
  ('form.name', 'en', 'Your name', 'forms'),
  ('form.name', 'de', 'Ihr Name', 'forms'),
  ('form.name', 'uk', 'Ваше ім''я', 'forms'),
  ('form.name', 'zh', '您的姓名', 'forms'),

  ('form.email', 'ru', 'Email', 'forms'),
  ('form.email', 'en', 'Email', 'forms'),
  ('form.email', 'de', 'E-Mail', 'forms'),
  ('form.email', 'uk', 'Email', 'forms'),
  ('form.email', 'zh', '电子邮件', 'forms'),

  ('form.message', 'ru', 'Сообщение', 'forms'),
  ('form.message', 'en', 'Message', 'forms'),
  ('form.message', 'de', 'Nachricht', 'forms'),
  ('form.message', 'uk', 'Повідомлення', 'forms'),
  ('form.message', 'zh', '消息', 'forms'),

  ('form.telegram', 'ru', 'Telegram (необязательно)', 'forms'),
  ('form.telegram', 'en', 'Telegram (optional)', 'forms'),
  ('form.telegram', 'de', 'Telegram (optional)', 'forms'),
  ('form.telegram', 'uk', 'Telegram (необов''язково)', 'forms'),
  ('form.telegram', 'zh', 'Telegram（可选）', 'forms'),

  ('form.submit', 'ru', 'Отправить', 'forms'),
  ('form.submit', 'en', 'Submit', 'forms'),
  ('form.submit', 'de', 'Einreichen', 'forms'),
  ('form.submit', 'uk', 'Надіслати', 'forms'),
  ('form.submit', 'zh', '提交', 'forms'),

  ('modal.demo_title', 'ru', 'Запросить демо-аккаунт', 'forms'),
  ('modal.demo_title', 'en', 'Request Demo Account', 'forms'),
  ('modal.demo_title', 'de', 'Demo-Konto anfordern', 'forms'),
  ('modal.demo_title', 'uk', 'Запросити демо-акаунт', 'forms'),
  ('modal.demo_title', 'zh', '申请演示账户', 'forms'),

  ('button.all_articles', 'ru', 'Все статьи', 'buttons'),
  ('button.all_articles', 'en', 'All Articles', 'buttons'),
  ('button.all_articles', 'de', 'Alle Artikel', 'buttons'),
  ('button.all_articles', 'uk', 'Всі статті', 'buttons'),
  ('button.all_articles', 'zh', '所有文章', 'buttons'),

  ('button.all_questions', 'ru', 'Все вопросы', 'buttons'),
  ('button.all_questions', 'en', 'All Questions', 'buttons'),
  ('button.all_questions', 'de', 'Alle Fragen', 'buttons'),
  ('button.all_questions', 'uk', 'Всі питання', 'buttons'),
  ('button.all_questions', 'zh', '所有问题', 'buttons')
ON CONFLICT (key, language) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();

-- Add site images to database
INSERT INTO site_images (key, url, alt_text, category) VALUES
  ('logo', '/logo.svg', 'MakeTrades логотип - платформа для создания брокеров', 'branding'),
  ('icon_user', '/icons/user.svg', 'Иконка пользователя', 'icons'),
  ('icon_check', '/icons/check.svg', 'Иконка галочки', 'icons'),
  ('icon_check_circle', '/icons/check-circle.svg', 'Иконка круга с галочкой', 'icons'),
  
  ('hero_main', 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Торговая платформа MakeTrades с графиками и инструментами анализа', 'hero'),
  
  ('feature_terminals', 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка торгового терминала с множественными графиками', 'features'),
  ('feature_apps', 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка мобильных приложений для iOS и Android', 'features'),
  ('feature_instruments', 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка финансовых инструментов и котировок', 'features'),
  ('feature_settings', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка настройки спредов и комиссий', 'features'),
  ('feature_investments', 'https://images.pexels.com/photos/7567528/pexels-photo-7567528.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка инвестиционного портфеля и копирования сделок', 'features'),
  ('feature_prop', 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка Prop-trading и бинарных опционов', 'features'),
  ('feature_store', 'https://images.pexels.com/photos/8358031/pexels-photo-8358031.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка магазина торговых ботов и индикаторов', 'features'),
  ('feature_crypto', 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка криптовалютного процессинга', 'features'),
  ('feature_api', 'https://images.pexels.com/photos/5980866/pexels-photo-5980866.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка API интеграций платежных систем', 'features'),
  ('feature_companies', 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка довольных клиентов, использующих платформу', 'features'),
  ('feature_crm', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка CRM системы для управления клиентами', 'features'),
  ('feature_partner', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', 'Иконка партнерской программы и IB-кабинета', 'features'),
  
  ('detailed_best_solution', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800', 'Торговый терминал с графиками и аналитическими инструментами', 'detailed_features'),
  ('detailed_bot_store', 'https://images.pexels.com/photos/8358031/pexels-photo-8358031.jpeg?auto=compress&cs=tinysrgb&w=800', 'Магазин торговых ботов с различными стратегиями', 'detailed_features'),
  ('detailed_portfolios', 'https://images.pexels.com/photos/7567528/pexels-photo-7567528.jpeg?auto=compress&cs=tinysrgb&w=800', 'Инвестиционные портфели с графиками доходности', 'detailed_features')
ON CONFLICT (key) DO UPDATE
  SET url = EXCLUDED.url, alt_text = EXCLUDED.alt_text, updated_at = now();
