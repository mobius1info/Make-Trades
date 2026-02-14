/*
  # Add math CAPTCHA translations

  1. New translations
    - `form.captcha_label` - label for the math challenge field
    - `error.captcha_wrong` - error message when answer is incorrect
    All in 5 languages: ru, en, de, uk, zh
*/

INSERT INTO translations (key, language, value) VALUES
  ('form.captcha_label', 'ru', 'Решите пример:'),
  ('form.captcha_label', 'en', 'Solve the problem:'),
  ('form.captcha_label', 'de', 'Rechenaufgabe:'),
  ('form.captcha_label', 'uk', 'Розв''яжіть приклад:'),
  ('form.captcha_label', 'zh', '请计算:'),
  ('error.captcha_wrong', 'ru', 'Неверный ответ, попробуйте ещё раз'),
  ('error.captcha_wrong', 'en', 'Wrong answer, please try again'),
  ('error.captcha_wrong', 'de', 'Falsche Antwort, bitte versuchen Sie es erneut'),
  ('error.captcha_wrong', 'uk', 'Неправильна відповідь, спробуйте ще раз'),
  ('error.captcha_wrong', 'zh', '答案错误，请重试')
ON CONFLICT (key, language) DO UPDATE SET value = EXCLUDED.value, updated_at = now();