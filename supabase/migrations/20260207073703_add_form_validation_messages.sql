/*
  # Add form validation and feedback messages
  
  1. Changes
    - Add translation keys for form validation messages
    - Add translation keys for success/error feedback
    - Add translation keys for checkbox labels
  
  2. Languages
    - Russian (ru)
    - English (en)
    - German (de)
    - Ukrainian (uk)
    - Chinese (zh)
*/

INSERT INTO translations (key, language, value, category) VALUES
  -- Checkbox label
  ('form.not_robot', 'ru', 'Я не робот', 'forms'),
  ('form.not_robot', 'en', 'I am not a robot', 'forms'),
  ('form.not_robot', 'de', 'Ich bin kein Roboter', 'forms'),
  ('form.not_robot', 'uk', 'Я не робот', 'forms'),
  ('form.not_robot', 'zh', '我不是机器人', 'forms'),
  
  -- Validation errors
  ('error.robot_check', 'ru', 'Подтвердите, что вы не робот', 'forms'),
  ('error.robot_check', 'en', 'Please confirm you are not a robot', 'forms'),
  ('error.robot_check', 'de', 'Bitte bestätigen Sie, dass Sie kein Roboter sind', 'forms'),
  ('error.robot_check', 'uk', 'Підтвердіть, що ви не робот', 'forms'),
  ('error.robot_check', 'zh', '请确认您不是机器人', 'forms'),
  
  -- Success messages
  ('success.demo_submitted', 'ru', 'Спасибо! Мы свяжемся с вами в ближайшее время.', 'forms'),
  ('success.demo_submitted', 'en', 'Thank you! We will contact you shortly.', 'forms'),
  ('success.demo_submitted', 'de', 'Danke! Wir werden uns in Kürze bei Ihnen melden.', 'forms'),
  ('success.demo_submitted', 'uk', 'Дякуємо! Ми зв''яжемося з вами найближчим часом.', 'forms'),
  ('success.demo_submitted', 'zh', '谢谢！我们会尽快与您联系。', 'forms'),
  
  ('success.contact_submitted', 'ru', 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.', 'forms'),
  ('success.contact_submitted', 'en', 'Thank you for your message! We will contact you shortly.', 'forms'),
  ('success.contact_submitted', 'de', 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.', 'forms'),
  ('success.contact_submitted', 'uk', 'Дякуємо за ваше повідомлення! Ми зв''яжемося з вами найближчим часом.', 'forms'),
  ('success.contact_submitted', 'zh', '感谢您的留言！我们会尽快与您联系。', 'forms'),
  
  -- Error messages
  ('error.submit_failed', 'ru', 'Произошла ошибка. Пожалуйста, попробуйте позже.', 'forms'),
  ('error.submit_failed', 'en', 'An error occurred. Please try again later.', 'forms'),
  ('error.submit_failed', 'de', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'forms'),
  ('error.submit_failed', 'uk', 'Сталася помилка. Будь ласка, спробуйте пізніше.', 'forms'),
  ('error.submit_failed', 'zh', '发生错误。请稍后再试。', 'forms')
ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
