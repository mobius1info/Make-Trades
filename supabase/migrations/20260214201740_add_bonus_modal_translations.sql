/*
  # Add bonus modal translations

  1. New translations
    - `bonus.title` - Modal title
    - `bonus.text` - Modal description text
    - `bonus.email_btn` - Email button label
    - `bonus.telegram_btn` - Telegram button label
    - `form.telegram` - Updated optional Telegram placeholder
  2. Languages: ru, en, de, uk, zh
  3. Categories: bonus, form
*/

INSERT INTO translations (key, language, value, category)
VALUES
  ('bonus.title', 'ru', 'Получите бонусы!', 'bonus'),
  ('bonus.title', 'en', 'Get Bonuses!', 'bonus'),
  ('bonus.title', 'de', 'Boni erhalten!', 'bonus'),
  ('bonus.title', 'uk', 'Отримайте бонуси!', 'bonus'),
  ('bonus.title', 'zh', '获取奖金！', 'bonus'),

  ('bonus.text', 'ru', 'Напишите нам на почту — мы дадим вам персональные бонусы и поможем с настройкой!', 'bonus'),
  ('bonus.text', 'en', 'Write to us by email — we will give you personal bonuses and help with setup!', 'bonus'),
  ('bonus.text', 'de', 'Schreiben Sie uns per E-Mail — wir geben Ihnen personliche Boni und helfen bei der Einrichtung!', 'bonus'),
  ('bonus.text', 'uk', 'Напишiть нам на пошту — ми дамо вам персональнi бонуси та допоможемо з налаштуванням!', 'bonus'),
  ('bonus.text', 'zh', '给我们发邮件——我们将为您提供个人奖金并帮助您进行设置！', 'bonus'),

  ('bonus.email_btn', 'ru', 'sales@maketrades.space', 'bonus'),
  ('bonus.email_btn', 'en', 'sales@maketrades.space', 'bonus'),
  ('bonus.email_btn', 'de', 'sales@maketrades.space', 'bonus'),
  ('bonus.email_btn', 'uk', 'sales@maketrades.space', 'bonus'),
  ('bonus.email_btn', 'zh', 'sales@maketrades.space', 'bonus'),

  ('bonus.telegram_btn', 'ru', 'Написать в Telegram', 'bonus'),
  ('bonus.telegram_btn', 'en', 'Write on Telegram', 'bonus'),
  ('bonus.telegram_btn', 'de', 'In Telegram schreiben', 'bonus'),
  ('bonus.telegram_btn', 'uk', 'Написати в Telegram', 'bonus'),
  ('bonus.telegram_btn', 'zh', '通过Telegram联系', 'bonus'),

  ('form.telegram', 'ru', 'Telegram (необязательно)', 'form'),
  ('form.telegram', 'en', 'Telegram (optional)', 'form'),
  ('form.telegram', 'de', 'Telegram (optional)', 'form'),
  ('form.telegram', 'uk', 'Telegram (необов''язково)', 'form'),
  ('form.telegram', 'zh', 'Telegram（可选）', 'form')
ON CONFLICT (key, language) DO UPDATE SET value = EXCLUDED.value;
