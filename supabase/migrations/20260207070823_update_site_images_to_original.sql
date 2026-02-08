/*
  # Update Site Images to Original MakeTrades URLs

  1. Changes
    - Update all site_images to use original maketrades.space asset URLs
    - Replace Pexels placeholder images with actual branded images
*/

UPDATE site_images SET url = 'https://maketrades.space/assets/8be5d24b12059ded6d87.svg', updated_at = now() WHERE key = 'logo';
UPDATE site_images SET url = 'https://maketrades.space/assets/a6308856f6f5a12b2e78.svg', updated_at = now() WHERE key = 'icon_user';
UPDATE site_images SET url = 'https://maketrades.space/assets/4ec320d8d6377bc31ff1.svg', updated_at = now() WHERE key = 'icon_check';
UPDATE site_images SET url = 'https://maketrades.space/assets/d8410a197b13000a371e.svg', updated_at = now() WHERE key = 'icon_check_circle';

UPDATE site_images SET url = 'https://maketrades.space/assets/9e35ba27d1cef3fc4754.jpg', updated_at = now() WHERE key = 'hero_main';

UPDATE site_images SET url = 'https://maketrades.space/assets/db02cb0b6d032d05dbd0.png', updated_at = now() WHERE key = 'feature_terminals';
UPDATE site_images SET url = 'https://maketrades.space/assets/506feb222072fbf56410.png', updated_at = now() WHERE key = 'feature_apps';
UPDATE site_images SET url = 'https://maketrades.space/assets/0cd3babc330ad2c7d438.png', updated_at = now() WHERE key = 'feature_instruments';
UPDATE site_images SET url = 'https://maketrades.space/assets/85a6e57c148dcc05a450.png', updated_at = now() WHERE key = 'feature_settings';
UPDATE site_images SET url = 'https://maketrades.space/assets/ca8ee05b5e19179dbe8d.png', updated_at = now() WHERE key = 'feature_investments';
UPDATE site_images SET url = 'https://maketrades.space/assets/7c492d33078b5a0706a5.png', updated_at = now() WHERE key = 'feature_prop';
UPDATE site_images SET url = 'https://maketrades.space/assets/b4c329a07774891079c0.png', updated_at = now() WHERE key = 'feature_store';
UPDATE site_images SET url = 'https://maketrades.space/assets/5a4379cad6dff9dd03d5.png', updated_at = now() WHERE key = 'feature_crypto';
UPDATE site_images SET url = 'https://maketrades.space/assets/a89cda06253b85a88af0.png', updated_at = now() WHERE key = 'feature_api';
UPDATE site_images SET url = 'https://maketrades.space/assets/b9609fcb8a6681f841fe.png', updated_at = now() WHERE key = 'feature_companies';
UPDATE site_images SET url = 'https://maketrades.space/assets/3ec338daf75b7d5984ac.png', updated_at = now() WHERE key = 'feature_crm';
UPDATE site_images SET url = 'https://maketrades.space/assets/0be80d936f6983c6fd49.png', updated_at = now() WHERE key = 'feature_partner';

UPDATE site_images SET url = 'https://maketrades.space/assets/dd19b4c2891f629ac62b.jpg', updated_at = now() WHERE key = 'detailed_best_solution';
UPDATE site_images SET url = 'https://maketrades.space/assets/01a41df6556d8e588e43.jpg', updated_at = now() WHERE key = 'detailed_bot_store';
UPDATE site_images SET url = 'https://maketrades.space/assets/44221e265a38b1ff2471.jpg', updated_at = now() WHERE key = 'detailed_portfolios';
