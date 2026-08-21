/*
# Fix blog post image URLs

1. Normalizes all Pexels image URLs to include ?auto=compress&cs=tinysrgb&w=800
   - URLs without query params get sizing added
   - URLs with w=800 already are left alone
   - This fixes the image bug where full-size Pexels images were loading slowly or failing
2. No schema changes
3. No security changes
*/

UPDATE blog_posts
SET image_url = image_url || '?auto=compress&cs=tinysrgb&w=800'
WHERE image_url LIKE 'https://images.pexels.com/photos/%'
  AND image_url NOT LIKE '%?auto=compress%';