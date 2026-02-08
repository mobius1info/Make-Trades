/*
  # Create FAQ Items for All Languages

  1. Content
    - Create comprehensive FAQ items for RU, EN, DE, UK, ZH
    - Cover topics: pricing, features, support, customization, technical questions
    
  2. Categories
    - general (общие вопросы)
    - technical (технические вопросы)
    - pricing (цены)
    - support (поддержка)
*/

INSERT INTO faq_items (id, question, answer, language, "order", category, created_at) VALUES
-- Russian FAQs
(gen_random_uuid(), 'Сколько стоит платформа MakeTrades?', 'Стоимость платформы составляет от $1000 до $3000 в месяц в зависимости от выбранного пакета и дополнительных функций.', 'ru', 101, 'pricing', now()),
(gen_random_uuid(), 'Какие торговые инструменты доступны?', 'Платформа предоставляет доступ к более чем 500 инструментам, включая форекс, криптовалюты, акции и индексы.', 'ru', 102, 'general', now()),
(gen_random_uuid(), 'Предоставляете ли вы техническую поддержку?', 'Да, мы предоставляем круглосуточную техническую поддержку на русском, английском и немецком языках.', 'ru', 103, 'support', now()),
(gen_random_uuid(), 'Можно ли кастомизировать платформу под свой бренд?', 'Да, платформа полностью White Label - вы можете настроить дизайн, логотипы и брендинг под вашу компанию.', 'ru', 104, 'general', now()),
(gen_random_uuid(), 'Сколько времени занимает запуск брокера?', 'Стандартная установка занимает от 2 до 4 недель, включая настройку всех систем и интеграций.', 'ru', 105, 'technical', now()),
(gen_random_uuid(), 'Есть ли мобильные приложения?', 'Да, мы предоставляем готовые мобильные приложения для iOS и Android с возможностью публикации под вашим брендом.', 'ru', 106, 'general', now()),
(gen_random_uuid(), 'Какие платежные системы поддерживаются?', 'Платформа поддерживает интеграцию с любыми платежными системами через API, включая криптовалютный процессинг.', 'ru', 107, 'technical', now()),
(gen_random_uuid(), 'Нужна ли лицензия для работы?', 'Требования к лицензированию зависят от вашей юрисдикции. Мы предоставляем консультации по этому вопросу.', 'ru', 108, 'general', now()),
(gen_random_uuid(), 'Можно ли интегрировать собственную CRM?', 'Да, платформа имеет открытое API для интеграции с внешними системами, включая CRM.', 'ru', 109, 'technical', now()),
(gen_random_uuid(), 'Какие есть варианты ценообразования?', 'Мы предлагаем три тарифа: Start ($1000/мес), Professional ($2000/мес), Enterprise ($3000/мес).', 'ru', 110, 'pricing', now()),
(gen_random_uuid(), 'Предоставляется ли демо-доступ?', 'Да, мы предоставляем полнофункциональный демо-доступ на 14 дней для ознакомления с платформой.', 'ru', 111, 'general', now()),
(gen_random_uuid(), 'Как происходит обновление платформы?', 'Обновления выпускаются ежемесячно и устанавливаются автоматически без простоя системы.', 'ru', 112, 'technical', now()),
(gen_random_uuid(), 'Есть ли ограничения по количеству клиентов?', 'Нет, ограничений по количеству клиентов нет. Платформа масштабируется под любую нагрузку.', 'ru', 113, 'general', now()),
(gen_random_uuid(), 'Какая поддержка предоставляется при запуске?', 'Мы предоставляем полное сопровождение: от установки до обучения вашей команды работе с платформой.', 'ru', 114, 'support', now()),
(gen_random_uuid(), 'Можно ли добавить собственные торговые инструменты?', 'Да, вы можете добавлять собственные инструменты и настраивать параметры торговли.', 'ru', 115, 'technical', now()),

-- English FAQs
(gen_random_uuid(), 'How much does the MakeTrades platform cost?', 'The platform costs between $1000 and $3000 per month depending on the package and additional features.', 'en', 101, 'pricing', now()),
(gen_random_uuid(), 'What trading instruments are available?', 'The platform provides access to more than 500 instruments including forex, cryptocurrencies, stocks and indices.', 'en', 102, 'general', now()),
(gen_random_uuid(), 'Do you provide technical support?', 'Yes, we provide 24/7 technical support in Russian, English and German.', 'en', 103, 'support', now()),
(gen_random_uuid(), 'Can the platform be customized for my brand?', 'Yes, the platform is fully White Label - you can customize design, logos and branding for your company.', 'en', 104, 'general', now()),
(gen_random_uuid(), 'How long does it take to launch a brokerage?', 'Standard installation takes 2 to 4 weeks, including setup of all systems and integrations.', 'en', 105, 'technical', now()),
(gen_random_uuid(), 'Are mobile applications available?', 'Yes, we provide ready-made mobile applications for iOS and Android with the ability to publish under your brand.', 'en', 106, 'general', now()),
(gen_random_uuid(), 'What payment systems are supported?', 'The platform supports integration with any payment systems via API, including cryptocurrency processing.', 'en', 107, 'technical', now()),
(gen_random_uuid(), 'Is a license required to operate?', 'Licensing requirements depend on your jurisdiction. We provide consultations on this matter.', 'en', 108, 'general', now()),
(gen_random_uuid(), 'Can I integrate my own CRM?', 'Yes, the platform has an open API for integration with external systems, including CRM.', 'en', 109, 'technical', now()),
(gen_random_uuid(), 'What pricing options are available?', 'We offer three plans: Start ($1000/month), Professional ($2000/month), Enterprise ($3000/month).', 'en', 110, 'pricing', now()),
(gen_random_uuid(), 'Is demo access provided?', 'Yes, we provide full-featured demo access for 14 days to familiarize yourself with the platform.', 'en', 111, 'general', now()),
(gen_random_uuid(), 'How are platform updates handled?', 'Updates are released monthly and installed automatically without system downtime.', 'en', 112, 'technical', now()),
(gen_random_uuid(), 'Are there limits on the number of clients?', 'No, there are no limits on the number of clients. The platform scales to any load.', 'en', 113, 'general', now()),
(gen_random_uuid(), 'What support is provided during launch?', 'We provide full support: from installation to training your team to work with the platform.', 'en', 114, 'support', now()),
(gen_random_uuid(), 'Can I add my own trading instruments?', 'Yes, you can add your own instruments and configure trading parameters.', 'en', 115, 'technical', now()),

-- German FAQs
(gen_random_uuid(), 'Wie viel kostet die MakeTrades-Plattform?', 'Die Plattform kostet zwischen $1000 und $3000 pro Monat, abhängig vom Paket und zusätzlichen Funktionen.', 'de', 101, 'pricing', now()),
(gen_random_uuid(), 'Welche Handelsinstrumente sind verfügbar?', 'Die Plattform bietet Zugang zu über 500 Instrumenten, einschließlich Forex, Kryptowährungen, Aktien und Indizes.', 'de', 102, 'general', now()),
(gen_random_uuid(), 'Bieten Sie technischen Support an?', 'Ja, wir bieten 24/7 technischen Support auf Russisch, Englisch und Deutsch.', 'de', 103, 'support', now()),
(gen_random_uuid(), 'Kann die Plattform für meine Marke angepasst werden?', 'Ja, die Plattform ist vollständig White Label - Sie können Design, Logos und Branding für Ihr Unternehmen anpassen.', 'de', 104, 'general', now()),
(gen_random_uuid(), 'Wie lange dauert es, ein Brokerage zu starten?', 'Die Standardinstallation dauert 2 bis 4 Wochen, einschließlich der Einrichtung aller Systeme und Integrationen.', 'de', 105, 'technical', now()),
(gen_random_uuid(), 'Sind mobile Anwendungen verfügbar?', 'Ja, wir bieten fertige mobile Anwendungen für iOS und Android mit der Möglichkeit, unter Ihrer Marke zu veröffentlichen.', 'de', 106, 'general', now()),
(gen_random_uuid(), 'Welche Zahlungssysteme werden unterstützt?', 'Die Plattform unterstützt die Integration mit allen Zahlungssystemen über API, einschließlich Kryptowährungsverarbeitung.', 'de', 107, 'technical', now()),
(gen_random_uuid(), 'Ist eine Lizenz für den Betrieb erforderlich?', 'Die Lizenzierungsanforderungen hängen von Ihrer Gerichtsbarkeit ab. Wir bieten Beratung zu diesem Thema.', 'de', 108, 'general', now()),
(gen_random_uuid(), 'Kann ich mein eigenes CRM integrieren?', 'Ja, die Plattform verfügt über eine offene API für die Integration mit externen Systemen, einschließlich CRM.', 'de', 109, 'technical', now()),
(gen_random_uuid(), 'Welche Preisoptionen sind verfügbar?', 'Wir bieten drei Pläne an: Start ($1000/Monat), Professional ($2000/Monat), Enterprise ($3000/Monat).', 'de', 110, 'pricing', now()),
(gen_random_uuid(), 'Wird Demo-Zugang bereitgestellt?', 'Ja, wir bieten 14 Tage lang voll funktionsfähigen Demo-Zugang, um sich mit der Plattform vertraut zu machen.', 'de', 111, 'general', now()),
(gen_random_uuid(), 'Wie werden Plattform-Updates behandelt?', 'Updates werden monatlich veröffentlicht und automatisch ohne Systemausfallzeit installiert.', 'de', 112, 'technical', now()),
(gen_random_uuid(), 'Gibt es Grenzen für die Anzahl der Kunden?', 'Nein, es gibt keine Grenzen für die Anzahl der Kunden. Die Plattform skaliert für jede Last.', 'de', 113, 'general', now()),
(gen_random_uuid(), 'Welche Unterstützung wird während des Starts bereitgestellt?', 'Wir bieten vollständige Unterstützung: von der Installation bis zur Schulung Ihres Teams für die Arbeit mit der Plattform.', 'de', 114, 'support', now()),
(gen_random_uuid(), 'Kann ich meine eigenen Handelsinstrumente hinzufügen?', 'Ja, Sie können Ihre eigenen Instrumente hinzufügen und Handelsparameter konfigurieren.', 'de', 115, 'technical', now()),

-- Ukrainian FAQs
(gen_random_uuid(), 'Скільки коштує платформа MakeTrades?', 'Вартість платформи становить від $1000 до $3000 на місяць залежно від обраного пакету та додаткових функцій.', 'uk', 101, 'pricing', now()),
(gen_random_uuid(), 'Які торгові інструменти доступні?', 'Платформа надає доступ до понад 500 інструментів, включаючи форекс, криптовалюти, акції та індекси.', 'uk', 102, 'general', now()),
(gen_random_uuid(), 'Чи надаєте ви технічну підтримку?', 'Так, ми надаємо цілодобову технічну підтримку російською, англійською та німецькою мовами.', 'uk', 103, 'support', now()),
(gen_random_uuid(), 'Чи можна кастомізувати платформу під свій бренд?', 'Так, платформа повністю White Label - ви можете налаштувати дизайн, логотипи та брендинг під вашу компанію.', 'uk', 104, 'general', now()),
(gen_random_uuid(), 'Скільки часу займає запуск брокера?', 'Стандартне встановлення займає від 2 до 4 тижнів, включаючи налаштування всіх систем та інтеграцій.', 'uk', 105, 'technical', now()),
(gen_random_uuid(), 'Чи є мобільні додатки?', 'Так, ми надаємо готові мобільні додатки для iOS і Android з можливістю публікації під вашим брендом.', 'uk', 106, 'general', now()),
(gen_random_uuid(), 'Які платіжні системи підтримуються?', 'Платформа підтримує інтеграцію з будь-якими платіжними системами через API, включаючи криптовалютний процесинг.', 'uk', 107, 'technical', now()),
(gen_random_uuid(), 'Чи потрібна ліцензія для роботи?', 'Вимоги до ліцензування залежать від вашої юрисдикції. Ми надаємо консультації з цього питання.', 'uk', 108, 'general', now()),
(gen_random_uuid(), 'Чи можна інтегрувати власну CRM?', 'Так, платформа має відкритий API для інтеграції із зовнішніми системами, включаючи CRM.', 'uk', 109, 'technical', now()),
(gen_random_uuid(), 'Які є варіанти ціноутворення?', 'Ми пропонуємо три тарифи: Start ($1000/міс), Professional ($2000/міс), Enterprise ($3000/міс).', 'uk', 110, 'pricing', now()),
(gen_random_uuid(), 'Чи надається демо-доступ?', 'Так, ми надаємо повнофункціональний демо-доступ на 14 днів для ознайомлення з платформою.', 'uk', 111, 'general', now()),
(gen_random_uuid(), 'Як відбувається оновлення платформи?', 'Оновлення випускаються щомісяця і встановлюються автоматично без простою системи.', 'uk', 112, 'technical', now()),
(gen_random_uuid(), 'Чи є обмеження по кількості клієнтів?', 'Ні, обмежень по кількості клієнтів немає. Платформа масштабується під будь-яке навантаження.', 'uk', 113, 'general', now()),
(gen_random_uuid(), 'Яка підтримка надається при запуску?', 'Ми надаємо повний супровід: від встановлення до навчання вашої команди роботі з платформою.', 'uk', 114, 'support', now()),
(gen_random_uuid(), 'Чи можна додати власні торгові інструменти?', 'Так, ви можете додавати власні інструменти та налаштовувати параметри торгівлі.', 'uk', 115, 'technical', now()),

-- Chinese FAQs
(gen_random_uuid(), 'MakeTrades平台的费用是多少？', '该平台的费用在每月$1000至$3000之间，具体取决于套餐和附加功能。', 'zh', 101, 'pricing', now()),
(gen_random_uuid(), '有哪些交易工具可用？', '该平台提供超过500种工具的访问权限，包括外汇、加密货币、股票和指数。', 'zh', 102, 'general', now()),
(gen_random_uuid(), '你们提供技术支持吗？', '是的，我们提供24/7俄语、英语和德语技术支持。', 'zh', 103, 'support', now()),
(gen_random_uuid(), '平台可以为我的品牌定制吗？', '是的，该平台完全是白标的 - 您可以为您的公司定制设计、徽标和品牌。', 'zh', 104, 'general', now()),
(gen_random_uuid(), '启动经纪业务需要多长时间？', '标准安装需要2到4周，包括所有系统和集成的设置。', 'zh', 105, 'technical', now()),
(gen_random_uuid(), '有移动应用程序吗？', '是的，我们为iOS和Android提供现成的移动应用程序，可以在您的品牌下发布。', 'zh', 106, 'general', now()),
(gen_random_uuid(), '支持哪些支付系统？', '该平台通过API支持与任何支付系统的集成，包括加密货币处理。', 'zh', 107, 'technical', now()),
(gen_random_uuid(), '运营需要许可证吗？', '许可要求取决于您的司法管辖区。我们就此事提供咨询。', 'zh', 108, 'general', now()),
(gen_random_uuid(), '我可以集成自己的CRM吗？', '是的，该平台具有开放的API，可与包括CRM在内的外部系统集成。', 'zh', 109, 'technical', now()),
(gen_random_uuid(), '有哪些定价选项？', '我们提供三种计划：Start（$1000/月）、Professional（$2000/月）、Enterprise（$3000/月）。', 'zh', 110, 'pricing', now()),
(gen_random_uuid(), '提供演示访问吗？', '是的，我们提供14天的全功能演示访问，以便您熟悉平台。', 'zh', 111, 'general', now()),
(gen_random_uuid(), '平台更新如何处理？', '更新每月发布，并在没有系统停机的情况下自动安装。', 'zh', 112, 'technical', now()),
(gen_random_uuid(), '客户数量有限制吗？', '不，客户数量没有限制。该平台可扩展到任何负载。', 'zh', 113, 'general', now()),
(gen_random_uuid(), '启动期间提供什么支持？', '我们提供全面支持：从安装到培训您的团队使用平台。', 'zh', 114, 'support', now()),
(gen_random_uuid(), '我可以添加自己的交易工具吗？', '是的，您可以添加自己的工具并配置交易参数。', 'zh', 115, 'technical', now())

ON CONFLICT (id) DO NOTHING;