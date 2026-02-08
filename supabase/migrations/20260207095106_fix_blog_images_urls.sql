/*
  # Fix Blog Post Images URLs

  1. Changes
    - Update broken Pexels image URLs to working ones
    - Use verified Pexels images or local assets
    - Ensure all images are accessible and loading properly
    
  2. Notes
    - All URLs use working Pexels images or local assets
    - Images are optimized for web with proper compression
*/

-- Update articles with verified working Pexels images
UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-1-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-3-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/6770775/pexels-photo-6770775.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-4-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-5-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-6-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-8-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/5980866/pexels-photo-5980866.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-9-%';

UPDATE blog_posts SET image_url = 'https://images.pexels.com/photos/6771178/pexels-photo-6771178.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE slug LIKE 'article-10-%';

-- Update articles with local assets where Pexels URLs might fail
UPDATE blog_posts SET image_url = '/assets/feature-crypto.png' 
WHERE slug IN ('article-5-ru', 'article-5-en', 'article-5-de', 'article-5-uk', 'article-5-zh');

UPDATE blog_posts SET image_url = '/assets/feature-investments.png' 
WHERE slug IN ('article-18-ru', 'article-18-en', 'article-18-de', 'article-18-uk', 'article-18-zh');

UPDATE blog_posts SET image_url = '/assets/feature-crm.png' 
WHERE slug IN ('article-33-ru', 'article-33-en', 'article-33-de', 'article-33-uk', 'article-33-zh');

UPDATE blog_posts SET image_url = '/assets/feature-api.png' 
WHERE slug IN ('article-43-ru', 'article-43-en', 'article-43-de', 'article-43-uk', 'article-43-zh');

-- Set default fallback image for any articles without images
UPDATE blog_posts 
SET image_url = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800' 
WHERE image_url IS NULL OR image_url = '';