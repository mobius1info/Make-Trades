/*
# Add cross-linking to all remaining articles without internal links

1. Updates 21 existing RU articles that currently have 0 internal links
2. Each article gets 3-5 relevant in-text links to other articles
3. Links are placed in a "Читайте также" section at the end of each article
4. Articles are matched by topic/category for relevant cross-linking
5. This completes the bidirectional cross-linking network across ALL articles
*/

-- post-1-ru: Топ 10 торговых стратегий для начинающих
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=tehnicheskiy-analiz-dlya-nachinayuschih">Технический анализ для начинающих: основы и стратегии</a></li>
<li><a href="/blog-post.html?slug=forex-vs-akcii-vs-kriptovalyuty">Форекс vs Акции vs Криптовалюты: сравнение рынков</a></li>
<li><a href="/blog-post.html?slug=post-4-ru">Управление рисками в трейдинге</a></li>
<li><a href="/blog-post.html?slug=social-trading-platforma">Социальный трейдинг: платформа для копирования сделок</a></li>
<li><a href="/blog-post.html?slug=algoritmicheskiy-trejding-torgovy-bot">Алгоритмический трейдинг: создание торгового бота</a></li>
</ul>'
WHERE slug = 'post-1-ru' AND language = 'ru';

-- post-2-ru: Как выбрать надежного брокера в 2026
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=kak-vybrat-brokera-chek-list">Как выбрать брокера: чек-лист из 15 пунктов</a></li>
<li><a href="/blog-post.html?slug=litsenzirovanie-brokerskoy-deyatelnosti">Лицензирование брокерской деятельности</a></li>
<li><a href="/blog-post.html?slug=kak-vybrat-torgovuyu-platformu-dlya-brokera">Как выбрать торговую платформу для брокера</a></li>
<li><a href="/blog-post.html?slug=marketing-dlya-brokerov-kak-privlech-klientov">Маркетинг для брокеров: привлечение клиентов</a></li>
</ul>'
WHERE slug = 'post-2-ru' AND language = 'ru';

-- post-3-ru: Технический анализ: полное руководство
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=tehnicheskiy-analiz-dlya-nachinayuschih">Технический анализ для начинающих</a></li>
<li><a href="/blog-post.html?slug=post-9-ru">Индикаторы технического анализа</a></li>
<li><a href="/blog-post.html?slug=post-10-ru">Свечной анализ: японские свечи</a></li>
<li><a href="/blog-post.html?slug=fundamentalny-analiz-novosti-rynki">Фундаментальный анализ: новости и рынки</a></li>
<li><a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ в трейдинге 2026</a></li>
</ul>'
WHERE slug = 'post-3-ru' AND language = 'ru';

-- post-4-ru: Управление рисками в трейдинге
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=upravlenie-riskami-a-book-b-book">Управление рисками: A-Book vs B-Book</a></li>
<li><a href="/blog-post.html?slug=upravlenie-kapitalom-trejding-pravilo-1-2">Управление капиталом: правило 1-2%</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий для начинающих</a></li>
<li><a href="/blog-post.html?slug=algorithmicheskaya-likvidnost-2026">Алгоритмическая ликвидность 2026</a></li>
</ul>'
WHERE slug = 'post-4-ru' AND language = 'ru';

-- post-5-ru: Криптовалютная торговля для начинающих
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=kriptovalyutny-brokeridg-osobennosti">Криптовалютный брокеридж: особенности</a></li>
<li><a href="/blog-post.html?slug=forex-vs-akcii-vs-kriptovalyuty">Форекс vs Акции vs Криптовалюты</a></li>
<li><a href="/blog-post.html?slug=defi-brokeridzh-2026">DeFi брокеридж 2026</a></li>
<li><a href="/blog-post.html?slug=nft-kollateral-kreditovanie">NFT как обеспечение для кредитования</a></li>
<li><a href="/blog-post.html?slug=regulyatsiya-mica-2026">Регуляция MiCA 2026</a></li>
</ul>'
WHERE slug = 'post-5-ru' AND language = 'ru';

-- post-6-ru: Форекс: основы валютного рынка
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=forex-vs-akcii-vs-kriptovalyuty">Форекс vs Акции vs Криптовалюты</a></li>
<li><a href="/blog-post.html?slug=fundamentalny-analiz-novosti-rynki">Фундаментальный анализ: новости и рынки</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий</a></li>
<li><a href="/blog-post.html?slug=tehnicheskiy-analiz-dlya-nachinayuschih">Технический анализ для начинающих</a></li>
</ul>'
WHERE slug = 'post-6-ru' AND language = 'ru';

-- post-7-ru: Торговые боты: автоматизация стратегий
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=algoritmicheskiy-trejding-torgovy-bot">Алгоритмический трейдинг: создание бота</a></li>
<li><a href="/blog-post.html?slug=preimuschestva-torgovyh-botov">Преимущества торговых ботов</a></li>
<li><a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ в трейдинге 2026</a></li>
<li><a href="/blog-post.html?slug=social-trading-platforma">Социальный трейдинг</a></li>
<li><a href="/blog-post.html?slug=copy-trading-kak-zarabatyvat">Copy Trading: как зарабатывать</a></li>
</ul>'
WHERE slug = 'post-7-ru' AND language = 'ru';

-- post-8-ru: Психология трейдинга
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=psihologiya-trejdinga-emotsii">Психология трейдинга: эмоции на рынке</a></li>
<li><a href="/blog-post.html?slug=upravlenie-kapitalom-trejding-pravilo-1-2">Управление капиталом: правило 1-2%</a></li>
<li><a href="/blog-post.html?slug=post-4-ru">Управление рисками в трейдинге</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий</a></li>
</ul>'
WHERE slug = 'post-8-ru' AND language = 'ru';

-- post-9-ru: Индикаторы технического анализа
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=tehnicheskiy-analiz-dlya-nachinayuschih">Технический анализ для начинающих</a></li>
<li><a href="/blog-post.html?slug=post-3-ru">Технический анализ: полное руководство</a></li>
<li><a href="/blog-post.html?slug=post-10-ru">Свечной анализ: японские свечи</a></li>
<li><a href="/blog-post.html?slug=fundamentalny-analiz-novosti-rynki">Фундаментальный анализ</a></li>
</ul>'
WHERE slug = 'post-9-ru' AND language = 'ru';

-- post-10-ru: Свечной анализ: японские свечи
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=tehnicheskiy-analiz-dlya-nachinayuschih">Технический анализ для начинающих</a></li>
<li><a href="/blog-post.html?slug=post-3-ru">Технический анализ: полное руководство</a></li>
<li><a href="/blog-post.html?slug=post-9-ru">Индикаторы технического анализа</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий</a></li>
</ul>'
WHERE slug = 'post-10-ru' AND language = 'ru';

-- crm-dlya-brokera-avtomatizatsiya
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=marketing-dlya-brokerov-kak-privlech-klientov">Маркетинг для брокеров</a></li>
<li><a href="/blog-post.html?slug=kak-sozdat-brokerskuyu-kompaniyu">Как создать брокерскую компанию с нуля</a></li>
<li><a href="/blog-post.html?slug=kak-vybrat-torgovuyu-platformu-dlya-brokera">Как выбрать торговую платформу</a></li>
<li><a href="/blog-post.html?slug=litsenzirovanie-brokerskoy-deyatelnosti">Лицензирование брокерской деятельности</a></li>
</ul>'
WHERE slug = 'crm-dlya-brokera-avtomatizatsiya' AND language = 'ru';

-- fundamentalny-analiz-novosti-rynki
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=tehnicheskiy-analiz-dlya-nachinayuschih">Технический анализ для начинающих</a></li>
<li><a href="/blog-post.html?slug=post-3-ru">Технический анализ: полное руководство</a></li>
<li><a href="/blog-post.html?slug=forex-vs-akcii-vs-kriptovalyuty">Форекс vs Акции vs Криптовалюты</a></li>
<li><a href="/blog-post.html?slug=post-6-ru">Форекс: основы валютного рынка</a></li>
<li><a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ в трейдинге 2026</a></li>
</ul>'
WHERE slug = 'fundamentalny-analiz-novosti-rynki' AND language = 'ru';

-- tehnicheskiy-analiz-dlya-nachinayuschih
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=post-3-ru">Технический анализ: полное руководство</a></li>
<li><a href="/blog-post.html?slug=post-9-ru">Индикаторы технического анализа</a></li>
<li><a href="/blog-post.html?slug=post-10-ru">Свечной анализ: японские свечи</a></li>
<li><a href="/blog-post.html?slug=fundamentalny-analiz-novosti-rynki">Фундаментальный анализ</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий</a></li>
</ul>'
WHERE slug = 'tehnicheskiy-analiz-dlya-nachinayuschih' AND language = 'ru';

-- forex-vs-akcii-vs-kriptovalyuty
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=post-6-ru">Форекс: основы валютного рынка</a></li>
<li><a href="/blog-post.html?slug=kriptovalyutny-brokeridg-osobennosti">Криптовалютный брокеридж</a></li>
<li><a href="/blog-post.html?slug=post-5-ru">Криптовалютная торговля для начинающих</a></li>
<li><a href="/blog-post.html?slug=fundamentalny-analiz-novosti-rynki">Фундаментальный анализ</a></li>
<li><a href="/blog-post.html?slug=defi-brokeridzh-2026">DeFi брокеридж 2026</a></li>
</ul>'
WHERE slug = 'forex-vs-akcii-vs-kriptovalyuty' AND language = 'ru';

-- top-10-trendov-brokerskogo-biznesa-2024
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ в трейдинге 2026</a></li>
<li><a href="/blog-post.html?slug=defi-brokeridzh-2026">DeFi брокеридж 2026</a></li>
<li><a href="/blog-post.html?slug=social-trading-platforma">Социальный трейдинг</a></li>
<li><a href="/blog-post.html?slug=esg-investitsii-brokery">ESG-инвестиции для брокеров</a></li>
<li><a href="/blog-post.html?slug=metavers-trading-platforms">Трейдинг в метавселенной</a></li>
</ul>'
WHERE slug = 'top-10-trendov-brokerskogo-biznesa-2024' AND language = 'ru';

-- copy-trading-kak-zarabatyvat
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=social-trading-platforma">Социальный трейдинг: платформа для копирования</a></li>
<li><a href="/blog-post.html?slug=post-7-ru">Торговые боты: автоматизация стратегий</a></li>
<li><a href="/blog-post.html?slug=algoritmicheskiy-trejding-torgovy-bot">Алгоритмический трейдинг: создание бота</a></li>
<li><a href="/blog-post.html?slug=preimuschestva-torgovyh-botov">Преимущества торговых ботов</a></li>
</ul>'
WHERE slug = 'copy-trading-kak-zarabatyvat' AND language = 'ru';

-- kak-vybrat-brokera-chek-list
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=post-2-ru">Как выбрать надежного брокера в 2026</a></li>
<li><a href="/blog-post.html?slug=litsenzirovanie-brokerskoy-deyatelnosti">Лицензирование брокерской деятельности</a></li>
<li><a href="/blog-post.html?slug=kak-vybrat-torgovuyu-platformu-dlya-brokera">Как выбрать торговую платформу</a></li>
<li><a href="/blog-post.html?slug=upravlenie-riskami-a-book-b-book">Управление рисками: A-Book vs B-Book</a></li>
</ul>'
WHERE slug = 'kak-vybrat-brokera-chek-list' AND language = 'ru';

-- upravlenie-kapitalom-trejding-pravilo-1-2
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=upravlenie-riskami-a-book-b-book">Управление рисками: A-Book vs B-Book</a></li>
<li><a href="/blog-post.html?slug=post-4-ru">Управление рисками в трейдинге</a></li>
<li><a href="/blog-post.html?slug=psihologiya-trejdinga-emotsii">Психология трейдинга: эмоции</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий</a></li>
</ul>'
WHERE slug = 'upravlenie-kapitalom-trejding-pravilo-1-2' AND language = 'ru';

-- kriptovalyutny-brokeridg-osobennosti
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=defi-brokeridzh-2026">DeFi брокеридж 2026</a></li>
<li><a href="/blog-post.html?slug=regulyatsiya-mica-2026">Регуляция MiCA 2026</a></li>
<li><a href="/blog-post.html?slug=nft-kollateral-kreditovanie">NFT как обеспечение</a></li>
<li><a href="/blog-post.html?slug=post-5-ru">Криптовалютная торговля для начинающих</a></li>
<li><a href="/blog-post.html?slug=forex-vs-akcii-vs-kriptovalyuty">Форекс vs Акции vs Криптовалюты</a></li>
</ul>'
WHERE slug = 'kriptovalyutny-brokeridg-osobennosti' AND language = 'ru';

-- psihologiya-trejdinga-emotsii
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=post-8-ru">Психология трейдинга: контроль эмоций</a></li>
<li><a href="/blog-post.html?slug=upravlenie-kapitalom-trejding-pravilo-1-2">Управление капиталом: правило 1-2%</a></li>
<li><a href="/blog-post.html?slug=post-4-ru">Управление рисками в трейдинге</a></li>
<li><a href="/blog-post.html?slug=post-1-ru">Топ 10 торговых стратегий</a></li>
</ul>'
WHERE slug = 'psihologiya-trejdinga-emotsii' AND language = 'ru';

-- preimuschestva-torgovyh-botov
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=algoritmicheskiy-trejding-torgovy-bot">Алгоритмический трейдинг: создание бота</a></li>
<li><a href="/blog-post.html?slug=post-7-ru">Торговые боты: автоматизация стратегий</a></li>
<li><a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ в трейдинге 2026</a></li>
<li><a href="/blog-post.html?slug=copy-trading-kak-zarabatyvat">Copy Trading: как зарабатывать</a></li>
</ul>'
WHERE slug = 'preimuschestva-torgovyh-botov' AND language = 'ru';

-- kak-sozdat-brokerskuyu-kompaniyu
UPDATE blog_posts SET content = content || '
<h2>Читайте также</h2>
<ul>
<li><a href="/blog-post.html?slug=litsenzirovanie-brokerskoy-deyatelnosti">Лицензирование брокерской деятельности</a></li>
<li><a href="/blog-post.html?slug=kak-vybrat-torgovuyu-platformu-dlya-brokera">Как выбрать торговую платформу</a></li>
<li><a href="/blog-post.html?slug=crm-dlya-brokera-avtomatizatsiya">CRM для брокера: автоматизация</a></li>
<li><a href="/blog-post.html?slug=marketing-dlya-brokerov-kak-privlech-klientov">Маркетинг для брокеров</a></li>
<li><a href="/blog-post.html?slug=upravlenie-riskami-a-book-b-book">Управление рисками: A-Book vs B-Book</a></li>
</ul>'
WHERE slug = 'kak-sozdat-brokerskuyu-kompaniyu' AND language = 'ru';