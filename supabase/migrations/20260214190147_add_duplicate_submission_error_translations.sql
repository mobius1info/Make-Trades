/*
  # Add duplicate submission error translations

  1. New translations
    - `error.duplicate_submission` in all 5 languages (ru, en, de, uk, zh)
    - Message tells user they already submitted and should wait 24 hours
*/

INSERT INTO translations (key, language, value) VALUES
  ('error.duplicate_submission', 'ru', 'Вы уже отправляли заявку с этими данными. Пожалуйста, подождите 24 часа перед повторной отправкой.'),
  ('error.duplicate_submission', 'en', 'You have already submitted a request with these details. Please wait 24 hours before submitting again.'),
  ('error.duplicate_submission', 'de', 'Sie haben bereits eine Anfrage mit diesen Daten gesendet. Bitte warten Sie 24 Stunden, bevor Sie erneut senden.'),
  ('error.duplicate_submission', 'uk', 'Ви вже надсилали заявку з цими даними. Будь ласка, зачекайте 24 години перед повторним надсиланням.'),
  ('error.duplicate_submission', 'zh', '您已使用这些信息提交过请求。请等待24小时后再次提交。')
ON CONFLICT (key, language) DO UPDATE SET value = EXCLUDED.value, updated_at = now();