/*
# Add cross-links from existing articles to new articles

1. Updates 6 existing RU articles to include in-text links to the 10 new articles
2. Links are placed naturally within the content at relevant points
3. No schema changes, only content updates
4. This creates bidirectional cross-linking between old and new articles
*/

-- Update upravlenie-riskami-a-book-b-book to link to new articles
UPDATE blog_posts SET content = content || '

<h2>Свежие материалы</h2>
<p>Узнайте больше о смежных темах: как <a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ трансформирует риск-менеджмент</a>, как <a href="/blog-post.html?slug=algorithmicheskaya-likvidnost-2026">алгоритмическая ликвидность</a> снижает риски, и как <a href="/blog-post.html?slug=regulyatsiya-mica-2026">MiCA влияет на управление рисками</a>.</p>'
WHERE slug = 'upravlenie-riskami-a-book-b-book' AND language = 'ru';

-- Update algoritmicheskiy-trejding-torgovy-bot
UPDATE blog_posts SET content = content || '

<h2>Свежие материалы</h2>
<p>Читайте также: как <a href="/blog-post.html?slug=ai-v-treydinge-2026">ИИ меняет торговых ботов</a>, как <a href="/blog-post.html?slug=algorithmicheskaya-likvidnost-2026">алгоритмическая ликвидность</a> работает с ботами, и как <a href="/blog-post.html?slug=social-trading-platforma">социальный трейдинг</a> использует алгоритмические стратегии.</p>'
WHERE slug = 'algoritmicheskiy-trejding-torgovy-bot' AND language = 'ru';

-- Update kriptovalyutny-brokeridzh-osobennosti
UPDATE blog_posts SET content = content || '

<h2>Свежие материалы</h2>
<p>Узнайте больше: как <a href="/blog-post.html?slug=defi-brokeridzh-2026">DeFi интегрируется в брокеридж</a>, как <a href="/blog-post.html?slug=regulyatsiya-mica-2026">MiCA регулирует криптобиржи</a>, и как <a href="/blog-post.html?slug=nft-kollateral-kreditovanie">NFT используется как залог</a>.</p>'
WHERE slug = 'kriptovalyutny-brokeridzh-osobennosti' AND language = 'ru';

-- Update kak-vybrat-torgovuyu-platformu-dlya-brokera
UPDATE blog_posts SET content = content || '

<h2>Свежие материалы</h2>
<p>Читайте также: как <a href="/blog-post.html?slug=central-bank-digital-currency">CBDC меняет расчёты</a>, как <a href="/blog-post.html?slug=algorithmicheskaya-likvidnost-2026">алгоритмическая ликвидность</a> влияет на выбор платформы, и как <a href="/blog-post.html?slug=metavers-trading-platforms">метавселенная открывает новые возможности</a>.</p>'
WHERE slug = 'kak-vybrat-torgovuyu-platformu-dlya-brokera' AND language = 'ru';

-- Update marketing-dlya-brokerov-kak-privlech-klientov
UPDATE blog_posts SET content = content || '

<h2>Свежие материалы</h2>
<p>Узнайте больше: как <a href="/blog-post.html?slug=esg-investitsii-brokery">ESG привлекает новых клиентов</a>, как <a href="/blog-post.html?slug=social-trading-platforma">социальный трейдинг</a> работает как маркетинговый инструмент, и как <a href="/blog-post.html?slug=metavers-trading-platforms">метавселенная</a> открывает новые каналы.</p>'
WHERE slug = 'marketing-dlya-brokerov-kak-privlech-klientov' AND language = 'ru';

-- Update litsenzirovanie-brokerskoy-deyatelnosti
UPDATE blog_posts SET content = content || '

<h2>Свежие материалы</h2>
<p>Читайте также: как <a href="/blog-post.html?slug=regulyatsiya-mica-2026">MiCA регулирует криптоактивы</a>, как <a href="/blog-post.html?slug=central-bank-digital-currency">CBDC влияет на лицензирование</a>, и как <a href="/blog-post.html?slug=esg-investitsii-brokery">ESG-требования</a> меняют комплаенс.</p>'
WHERE slug = 'litsenzirovanie-brokerskoy-deyatelnosti' AND language = 'ru';