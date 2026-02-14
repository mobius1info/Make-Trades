/*
  # Add Telegram validation error translations

  1. New translations
    - `error.telegram_invalid` - Format validation error for Telegram username
    - `error.telegram_not_found` - Error when Telegram username does not exist
  2. Languages: ru, en, de, uk, zh
  3. Category: error
*/

INSERT INTO translations (key, language, value, category)
VALUES
  ('error.telegram_invalid', 'ru', 'Неверный формат ника Telegram (мин. 5 символов, латинские буквы, цифры, подчёркивания)', 'error'),
  ('error.telegram_invalid', 'en', 'Invalid Telegram username format (min 5 chars, latin letters, digits, underscores)', 'error'),
  ('error.telegram_invalid', 'de', 'Ungultiges Telegram-Benutzernamenformat (min. 5 Zeichen, lateinische Buchstaben, Ziffern, Unterstriche)', 'error'),
  ('error.telegram_invalid', 'uk', 'Невірний формат нiка Telegram (мін. 5 символів, латинські літери, цифри, підкреслення)', 'error'),
  ('error.telegram_invalid', 'zh', 'Telegram用户名格式无效（至少5个字符，拉丁字母、数字、下划线）', 'error'),

  ('error.telegram_not_found', 'ru', 'Этот ник Telegram не найден. Пожалуйста, проверьте правильность написания.', 'error'),
  ('error.telegram_not_found', 'en', 'This Telegram username was not found. Please check the spelling.', 'error'),
  ('error.telegram_not_found', 'de', 'Dieser Telegram-Benutzername wurde nicht gefunden. Bitte uberprufen Sie die Schreibweise.', 'error'),
  ('error.telegram_not_found', 'uk', 'Цей нiк Telegram не знайдено. Будь ласка, перевірте правильність написання.', 'error'),
  ('error.telegram_not_found', 'zh', '未找到此Telegram用户名。请检查拼写是否正确。', 'error')
ON CONFLICT (key, language) DO UPDATE SET value = EXCLUDED.value;
