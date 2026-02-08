/*
  # Add demo form button translation
  
  1. Changes
    - Add translation key for demo form submit button
  
  2. Languages
    - Russian (ru)
    - English (en)
    - German (de)
    - Ukrainian (uk)
    - Chinese (zh)
*/

INSERT INTO translations (key, language, value, category) VALUES
  ('form.request', 'ru', 'Запросить', 'forms'),
  ('form.request', 'en', 'Request', 'forms'),
  ('form.request', 'de', 'Anfragen', 'forms'),
  ('form.request', 'uk', 'Запросити', 'forms'),
  ('form.request', 'zh', '请求', 'forms')
ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
