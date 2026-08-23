-- Перелинковка в текстах статей: старая схема -> канонические адреса.
-- Применять в Supabase -> SQL Editor, шагами, сверху вниз.
--
-- Зачем: внутри content статей ссылки написаны как /blog-post.html?slug=X.
-- Этот адрес отдаёт пустую оболочку с canonical, одинаковым для всех статей,
-- поэтому сейчас он уводится редиректом 301. Ссылки работают, но каждый
-- переход - лишний прыжок, а Google видит промежуточный адрес.
-- Здесь они переписываются сразу на конечные /blog/ru/<slug>/.
--
-- Затрагивает 37 статей, 166 вхождений, 37 уникальных адресов. Все на русском.
-- Карта построена из фактических страниц сборки, поэтому несуществующих
-- адресов не появится. Отдельно учтены два случая:
--   * 10 технических слагов вида post-N-ru ведут на канонические статьи,
--     а не на заглушки с meta refresh, которые лежат под теми же именами;
--   * опечатка в исходной миграции (brokeridzh вместо brokeridg) - это
--     единственная по-настоящему битая ссылка, она чинится здесь же.
--
-- ВАЖНО: шаг 1 создаёт таблицу с копией текстов. Не удаляйте её, пока не
-- убедитесь, что всё в порядке - без неё откат невозможен.


-- ШАГ 1. Резервная копия текстов (выполнить обязательно).
CREATE TABLE IF NOT EXISTS blog_posts_crosslink_backup AS
SELECT id, content, updated_at
FROM blog_posts
WHERE content LIKE '%/blog-post.html?slug=%';

-- Проверка: должно быть 37 строк.
SELECT count(*) AS backed_up FROM blog_posts_crosslink_backup;


-- ШАГ 2. Что будет затронуто (только смотрим, ничего не меняем).
SELECT language, count(*) AS posts
FROM blog_posts
WHERE content LIKE '%/blog-post.html?slug=%'
GROUP BY language;


-- ШАГ 3. Сама замена.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
    ('ai-v-treydinge-2026', '/blog/ru/ai-v-treydinge-2026/'),
    ('algorithmicheskaya-likvidnost-2026', '/blog/ru/algorithmicheskaya-likvidnost-2026/'),
    ('algoritmicheskiy-trejding-torgovy-bot', '/blog/ru/algoritmicheskiy-trejding-torgovy-bot/'),
    ('central-bank-digital-currency', '/blog/ru/central-bank-digital-currency/'),
    ('copy-trading-kak-zarabatyvat', '/blog/ru/copy-trading-kak-zarabatyvat/'),
    ('crm-dlya-brokera-avtomatizatsiya', '/blog/ru/crm-dlya-brokera-avtomatizatsiya/'),
    ('defi-brokeridzh-2026', '/blog/ru/defi-brokeridzh-2026/'),
    ('esg-investitsii-brokery', '/blog/ru/esg-investitsii-brokery/'),
    ('forex-vs-akcii-vs-kriptovalyuty', '/blog/ru/forex-vs-akcii-vs-kriptovalyuty/'),
    ('fundamentalny-analiz-novosti-rynki', '/blog/ru/fundamentalny-analiz-novosti-rynki/'),
    ('kak-sozdat-brokerskuyu-kompaniyu', '/blog/ru/kak-sozdat-brokerskuyu-kompaniyu/'),
    ('kak-vybrat-brokera-chek-list', '/blog/ru/kak-vybrat-brokera-chek-list/'),
    ('kak-vybrat-torgovuyu-platformu-dlya-brokera', '/blog/ru/kak-vybrat-torgovuyu-platformu-dlya-brokera/'),
    ('kriptovalyutny-brokeridg-osobennosti', '/blog/ru/kriptovalyutny-brokeridg-osobennosti/'),
    ('kriptovalyutny-brokeridzh-osobennosti', '/blog/ru/kriptovalyutny-brokeridg-osobennosti/'),  -- опечатка в исходной миграции
    ('kvantovye-vychisleniya-finansy', '/blog/ru/kvantovye-vychisleniya-finansy/'),
    ('litsenzirovanie-brokerskoy-deyatelnosti', '/blog/ru/litsenzirovanie-brokerskoy-deyatelnosti/'),
    ('marketing-dlya-brokerov-kak-privlech-klientov', '/blog/ru/marketing-dlya-brokerov-kak-privlech-klientov/'),
    ('metavers-trading-platforms', '/blog/ru/metavers-trading-platforms/'),
    ('nft-kollateral-kreditovanie', '/blog/ru/nft-kollateral-kreditovanie/'),
    ('post-1-ru', '/blog/ru/top-10-torgovyh-strategiy-dlya-nachinayushchih/'),  -- технический слаг
    ('post-10-ru', '/blog/ru/svechnoy-analiz-yaponskie-svechi/'),  -- технический слаг
    ('post-2-ru', '/blog/ru/kak-vybrat-nadezhnogo-brokera-v-2026/'),  -- технический слаг
    ('post-3-ru', '/blog/ru/tehnicheskiy-analiz-polnoe-rukovodstvo/'),  -- технический слаг
    ('post-4-ru', '/blog/ru/upravlenie-riskami-v-treydinge/'),  -- технический слаг
    ('post-5-ru', '/blog/ru/kriptovalyutnaya-torgovlya-dlya-nachinayushchih/'),  -- технический слаг
    ('post-6-ru', '/blog/ru/foreks-osnovy-valyutnogo-rynka/'),  -- технический слаг
    ('post-7-ru', '/blog/ru/torgovye-boty-avtomatizatsiya-strategiy/'),  -- технический слаг
    ('post-8-ru', '/blog/ru/psihologiya-treydinga-kak-kontrolirovat-emotsii/'),  -- технический слаг
    ('post-9-ru', '/blog/ru/indikatory-tehnicheskogo-analiza/'),  -- технический слаг
    ('preimuschestva-torgovyh-botov', '/blog/ru/preimuschestva-torgovyh-botov/'),
    ('psihologiya-trejdinga-emotsii', '/blog/ru/psihologiya-trejdinga-emotsii/'),
    ('regulyatsiya-mica-2026', '/blog/ru/regulyatsiya-mica-2026/'),
    ('social-trading-platforma', '/blog/ru/social-trading-platforma/'),
    ('tehnicheskiy-analiz-dlya-nachinayuschih', '/blog/ru/tehnicheskiy-analiz-dlya-nachinayuschih/'),
    ('upravlenie-kapitalom-trejding-pravilo-1-2', '/blog/ru/upravlenie-kapitalom-trejding-pravilo-1-2/'),
    ('upravlenie-riskami-a-book-b-book', '/blog/ru/upravlenie-riskami-a-book-b-book/')
    ) AS t(old_slug, new_path)
  LOOP
    UPDATE blog_posts
    SET content = replace(content, '/blog-post.html?slug=' || r.old_slug, r.new_path),
        updated_at = now()
    WHERE content LIKE '%/blog-post.html?slug=' || r.old_slug || '%';
  END LOOP;
END
$$;


-- ШАГ 4. Проверка: обе цифры должны быть 0.
SELECT count(*) AS posts_with_old_links
FROM blog_posts
WHERE content LIKE '%/blog-post.html?slug=%';

SELECT count(*) AS posts_with_broken_link
FROM blog_posts
WHERE content LIKE '%kriptovalyutny-brokeridzh-osobennosti%';


-- ОТКАТ (если что-то пошло не так).
--
-- UPDATE blog_posts p
-- SET content = b.content,
--     updated_at = b.updated_at
-- FROM blog_posts_crosslink_backup b
-- WHERE p.id = b.id;


-- УБОРКА (только после того, как убедитесь, что всё хорошо).
--
-- DROP TABLE blog_posts_crosslink_backup;
