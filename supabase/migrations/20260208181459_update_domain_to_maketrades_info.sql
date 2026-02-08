/*
  # Update domain references from maketrades.space to maketrades.info

  1. Changes
    - Update all `site_images` URLs from maketrades.space to maketrades.info
    - Update any blog post image URLs referencing the old domain

  2. Important Notes
    - This migration ensures all stored URLs point to the correct production domain
    - No data is deleted, only URL prefixes are updated
*/

UPDATE site_images
SET url = REPLACE(url, 'maketrades.space', 'maketrades.info'),
    updated_at = now()
WHERE url LIKE '%maketrades.space%';

UPDATE blog_posts
SET image_url = REPLACE(image_url, 'maketrades.space', 'maketrades.info'),
    updated_at = now()
WHERE image_url LIKE '%maketrades.space%';
