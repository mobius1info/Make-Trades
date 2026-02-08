/*
  # Add form field validation error translations

  1. New Translations
    - `error.name_required` - Name field required error for all 5 languages
    - `error.email_required` - Email field required error for all 5 languages
    - `error.email_invalid` - Invalid email format error for all 5 languages
    - `error.message_required` - Message field required error for all 5 languages

  2. Purpose
    - Replace browser default validation tooltips with custom inline red error messages
    - Each language gets its own localized validation message
*/

INSERT INTO translations (key, language, value, category) VALUES
  ('error.name_required', 'ru', 'Пожалуйста, введите ваше имя', 'forms'),
  ('error.name_required', 'en', 'Please enter your name', 'forms'),
  ('error.name_required', 'de', 'Bitte geben Sie Ihren Namen ein', 'forms'),
  ('error.name_required', 'uk', 'Будь ласка, введіть ваше ім''я', 'forms'),
  ('error.name_required', 'zh', '请输入您的姓名', 'forms'),

  ('error.email_required', 'ru', 'Пожалуйста, введите email', 'forms'),
  ('error.email_required', 'en', 'Please enter your email', 'forms'),
  ('error.email_required', 'de', 'Bitte geben Sie Ihre E-Mail-Adresse ein', 'forms'),
  ('error.email_required', 'uk', 'Будь ласка, введіть email', 'forms'),
  ('error.email_required', 'zh', '请输入电子邮件', 'forms'),

  ('error.email_invalid', 'ru', 'Пожалуйста, введите корректный email', 'forms'),
  ('error.email_invalid', 'en', 'Please enter a valid email address', 'forms'),
  ('error.email_invalid', 'de', 'Bitte geben Sie eine gültige E-Mail-Adresse ein', 'forms'),
  ('error.email_invalid', 'uk', 'Будь ласка, введіть коректний email', 'forms'),
  ('error.email_invalid', 'zh', '请输入有效的电子邮件地址', 'forms'),

  ('error.message_required', 'ru', 'Пожалуйста, введите сообщение', 'forms'),
  ('error.message_required', 'en', 'Please enter your message', 'forms'),
  ('error.message_required', 'de', 'Bitte geben Sie Ihre Nachricht ein', 'forms'),
  ('error.message_required', 'uk', 'Будь ласка, введіть повідомлення', 'forms'),
  ('error.message_required', 'zh', '请输入消息', 'forms')
ON CONFLICT DO NOTHING;