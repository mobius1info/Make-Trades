# Управление статьями блога для SEO

## Что было сделано

### 1. Обновлены теги статей
Все статьи теперь имеют разнообразные теги, связанные с темой аренды форекс платформ:
- Аренда торговых платформ (MT4, MT5, cTrader)
- Белые метки и брокерские технологии
- CRM системы и бэк-офис
- Поставщики ликвидности
- Регуляция и лицензирование
- Риск-менеджмент
- И многие другие релевантные темы

### 2. Система скрытия статей от пользователей
Добавлена колонка `hidden_from_users` в таблицу `blog_posts`:
- **Когда `false`** (по умолчанию) - статья отображается в списках и доступна всем
- **Когда `true`** - статья НЕ отображается в списке блога, но:
  - Доступна по прямой ссылке для SEO-ботов
  - Индексируется поисковыми системами
  - Имеет все SEO-теги (meta, Open Graph, Schema.org)

## Как управлять скрытыми статьями

### Метод 1: Использование SQL-функций (Рекомендуется)

```sql
-- Скрыть несколько статей одной командой
SELECT hide_blog_posts(ARRAY['article-1-ru', 'article-2-ru', 'article-3-ru']);

-- Показать несколько статей одной командой
SELECT show_blog_posts(ARRAY['article-1-ru', 'article-2-ru']);

-- Посмотреть статистику по скрытым статьям
SELECT * FROM get_hidden_posts_count();

-- Статистика только для русского языка
SELECT * FROM get_hidden_posts_count('ru');
```

### Метод 2: Прямые SQL-запросы

Выполните SQL-запрос:

```sql
-- Скрыть конкретную статью по slug
UPDATE blog_posts
SET hidden_from_users = true
WHERE slug = 'article-5-ru';

-- Скрыть несколько статей
UPDATE blog_posts
SET hidden_from_users = true
WHERE slug IN ('article-1-ru', 'article-2-ru', 'article-3-ru');

-- Скрыть статьи определённой категории
UPDATE blog_posts
SET hidden_from_users = true
WHERE category = 'EDUCATION';

-- Скрыть первые 50 статей на русском
UPDATE blog_posts
SET hidden_from_users = true
WHERE language = 'ru'
AND slug ~ '^article-[1-9]$|^article-[1-4][0-9]$|^article-50$';
```

### Сделать статью снова видимой

```sql
-- Показать конкретную статью
UPDATE blog_posts
SET hidden_from_users = false
WHERE slug = 'article-5-ru';

-- Показать все скрытые статьи
UPDATE blog_posts
SET hidden_from_users = false
WHERE hidden_from_users = true;
```

### Проверить скрытые статьи

```sql
-- Посмотреть все скрытые статьи
SELECT slug, title, language, hidden_from_users
FROM blog_posts
WHERE hidden_from_users = true
ORDER BY slug;

-- Посчитать количество скрытых статей по языкам
SELECT language, COUNT(*) as hidden_count
FROM blog_posts
WHERE hidden_from_users = true
GROUP BY language;
```

## Как это работает

1. **На странице списка блога** (`/blog.html`):
   - Отображаются только статьи с `hidden_from_users = false`
   - Скрытые статьи не показываются в карточках

2. **На странице отдельной статьи** (`/blog-post.html`):
   - Статья доступна по прямой ссылке независимо от `hidden_from_users`
   - SEO-боты могут индексировать все статьи
   - Все мета-теги присутствуют

3. **Для SEO**:
   - Статьи остаются в sitemap
   - Поисковые системы могут их найти и проиндексировать
   - Пользователи не видят их в списке, но могут попасть из поисковика

## Проблема с картинками

Некоторые изображения Pexels могут не загружаться из-за:
- Удаления фото с Pexels
- Ограничений доступа
- Неверных ID фотографий

Все URL картинок используют формат:
```
https://images.pexels.com/photos/PHOTO_ID/pexels-photo-PHOTO_ID.jpeg?auto=compress&cs=tinysrgb&w=800
```

Вы можете обновить изображения статей:

```sql
-- Обновить изображение для конкретной статьи
UPDATE blog_posts
SET image_url = 'https://images.pexels.com/photos/NEW_ID/pexels-photo-NEW_ID.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'article-5-ru';

-- Использовать локальные изображения из папки /public/assets/
UPDATE blog_posts
SET image_url = '/assets/hero-main.jpg'
WHERE slug = 'article-5-ru';
```

## Примеры использования

### Скрыть первые 10 статей на всех языках

```sql
-- Скрыть первые 10 статей (article-1 до article-10) для всех языков
SELECT hide_blog_posts(
  ARRAY[
    'article-1-ru', 'article-2-ru', 'article-3-ru', 'article-4-ru', 'article-5-ru',
    'article-6-ru', 'article-7-ru', 'article-8-ru', 'article-9-ru', 'article-10-ru',
    'article-1-en', 'article-2-en', 'article-3-en', 'article-4-en', 'article-5-en',
    'article-6-en', 'article-7-en', 'article-8-en', 'article-9-en', 'article-10-en',
    'article-1-de', 'article-2-de', 'article-3-de', 'article-4-de', 'article-5-de',
    'article-6-de', 'article-7-de', 'article-8-de', 'article-9-de', 'article-10-de',
    'article-1-uk', 'article-2-uk', 'article-3-uk', 'article-4-uk', 'article-5-uk',
    'article-6-uk', 'article-7-uk', 'article-8-uk', 'article-9-uk', 'article-10-uk',
    'article-1-zh', 'article-2-zh', 'article-3-zh', 'article-4-zh', 'article-5-zh',
    'article-6-zh', 'article-7-zh', 'article-8-zh', 'article-9-zh', 'article-10-zh'
  ]
);
```

### Скрыть статьи по диапазону (например, 1-50)

```sql
-- Для русского языка
DO $$
DECLARE
  slugs text[];
  i integer;
BEGIN
  FOR i IN 1..50 LOOP
    slugs := array_append(slugs, 'article-' || i || '-ru');
  END LOOP;
  PERFORM hide_blog_posts(slugs);
END $$;

-- Проверить результат
SELECT * FROM get_hidden_posts_count('ru');
```

### Показать статистику и управлять

```sql
-- 1. Посмотреть текущую статистику
SELECT * FROM get_hidden_posts_count();

-- 2. Скрыть нужные статьи
SELECT hide_blog_posts(ARRAY['article-5-ru', 'article-10-ru']);

-- 3. Проверить обновлённую статистику
SELECT * FROM get_hidden_posts_count('ru');

-- 4. При необходимости показать статьи снова
SELECT show_blog_posts(ARRAY['article-5-ru']);
```
