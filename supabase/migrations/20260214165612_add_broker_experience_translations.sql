/*
  # Add translations for broker experience field and updated Telegram field

  1. New Translations
    - `form.broker_experience` - Question about broker experience (all languages)
    - `form.yes` / `form.no` - Yes/No options (all languages)
    - `form.telegram_required` - Updated Telegram placeholder (all languages)
    - `error.telegram_required` - Telegram validation error (all languages)
    - `error.broker_experience_required` - Broker experience validation error (all languages)

  2. Languages: ru, en, de, uk, zh
*/

INSERT INTO translations (language, key, value, category) VALUES
  ('ru', 'form.broker_experience', 'Был ли у вас опыт работы брокером?', 'form'),
  ('ru', 'form.yes', 'Да', 'form'),
  ('ru', 'form.no', 'Нет', 'form'),
  ('ru', 'form.telegram_required', 'Telegram', 'form'),
  ('ru', 'error.telegram_required', 'Пожалуйста, укажите ваш Telegram', 'error'),
  ('ru', 'error.broker_experience_required', 'Пожалуйста, выберите один из вариантов', 'error'),

  ('en', 'form.broker_experience', 'Have you had experience working as a broker?', 'form'),
  ('en', 'form.yes', 'Yes', 'form'),
  ('en', 'form.no', 'No', 'form'),
  ('en', 'form.telegram_required', 'Telegram', 'form'),
  ('en', 'error.telegram_required', 'Please enter your Telegram', 'error'),
  ('en', 'error.broker_experience_required', 'Please select an option', 'error'),

  ('de', 'form.broker_experience', 'Haben Sie Erfahrung als Broker?', 'form'),
  ('de', 'form.yes', 'Ja', 'form'),
  ('de', 'form.no', 'Nein', 'form'),
  ('de', 'form.telegram_required', 'Telegram', 'form'),
  ('de', 'error.telegram_required', 'Bitte geben Sie Ihren Telegram ein', 'error'),
  ('de', 'error.broker_experience_required', 'Bitte wählen Sie eine Option', 'error'),

  ('uk', 'form.broker_experience', 'Чи був у вас досвід роботи брокером?', 'form'),
  ('uk', 'form.yes', 'Так', 'form'),
  ('uk', 'form.no', 'Ні', 'form'),
  ('uk', 'form.telegram_required', 'Telegram', 'form'),
  ('uk', 'error.telegram_required', 'Будь ласка, вкажіть ваш Telegram', 'error'),
  ('uk', 'error.broker_experience_required', 'Будь ласка, оберіть один з варіантів', 'error'),

  ('zh', 'form.broker_experience', '您是否有经纪人工作经验？', 'form'),
  ('zh', 'form.yes', '是', 'form'),
  ('zh', 'form.no', '否', 'form'),
  ('zh', 'form.telegram_required', 'Telegram', 'form'),
  ('zh', 'error.telegram_required', '请输入您的Telegram', 'error'),
  ('zh', 'error.broker_experience_required', '请选择一个选项', 'error')
ON CONFLICT (language, key) DO UPDATE SET value = EXCLUDED.value;