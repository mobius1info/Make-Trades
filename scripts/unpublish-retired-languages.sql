-- Снятие с публикации статей на языках, убранных с сайта (de, uk, zh).
-- Применять в Supabase → SQL Editor.
--
-- На момент подготовки в базе есть только uk (88 опубликованных записей);
-- de и zh отсутствуют, условие оставлено на будущее.
--
-- Операция обратима: см. блок отката в конце файла.

-- 1. Что будет затронуто (сначала посмотрите, потом выполняйте UPDATE).
SELECT language, published, count(*)
FROM blog_posts
WHERE language IN ('de', 'uk', 'zh')
GROUP BY language, published
ORDER BY language, published;

-- 2. Само снятие с публикации.
UPDATE blog_posts
SET published = false
WHERE language IN ('de', 'uk', 'zh')
  AND published = true;

-- 3. Проверка: строк с published = true остаться не должно.
SELECT count(*) AS still_published
FROM blog_posts
WHERE language IN ('de', 'uk', 'zh')
  AND published = true;


-- ОТКАТ (если понадобится вернуть всё как было).
-- Внимание: вернёт published = true всем записям на этих языках, включая те,
-- что были сняты с публикации раньше. Точный список ранее опубликованных
-- id сохранён отдельно — см. отчёт к этой задаче.
--
-- UPDATE blog_posts
-- SET published = true
-- WHERE language IN ('de', 'uk', 'zh');
