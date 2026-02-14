/*
  # Add referral source form field translations

  1. New Translations
    - `form.referral_placeholder` - Placeholder text for the referral source dropdown
    - `form.referral_google` - Google search option
    - `form.referral_social` - Social media option
    - `form.referral_recommendation` - Recommendation option
    - `form.referral_ads` - Advertising option
    - `form.referral_other` - Other option
    - `error.referral_required` - Validation error message

  2. Languages
    - Russian (ru), English (en), German (de), Ukrainian (uk), Chinese (zh)
*/

INSERT INTO translations (key, language, value, category)
VALUES
  ('form.referral_placeholder', 'ru', 'Откуда узнали о нас? *', 'general'),
  ('form.referral_google', 'ru', 'Поиск в Google', 'general'),
  ('form.referral_social', 'ru', 'Социальные сети', 'general'),
  ('form.referral_recommendation', 'ru', 'Рекомендация', 'general'),
  ('form.referral_ads', 'ru', 'Реклама', 'general'),
  ('form.referral_other', 'ru', 'Другое', 'general'),
  ('error.referral_required', 'ru', 'Пожалуйста, укажите откуда вы узнали о нас', 'general'),

  ('form.referral_placeholder', 'en', 'How did you hear about us? *', 'general'),
  ('form.referral_google', 'en', 'Google Search', 'general'),
  ('form.referral_social', 'en', 'Social Media', 'general'),
  ('form.referral_recommendation', 'en', 'Recommendation', 'general'),
  ('form.referral_ads', 'en', 'Advertising', 'general'),
  ('form.referral_other', 'en', 'Other', 'general'),
  ('error.referral_required', 'en', 'Please select how you heard about us', 'general'),

  ('form.referral_placeholder', 'de', 'Wie haben Sie von uns erfahren? *', 'general'),
  ('form.referral_google', 'de', 'Google-Suche', 'general'),
  ('form.referral_social', 'de', 'Soziale Medien', 'general'),
  ('form.referral_recommendation', 'de', 'Empfehlung', 'general'),
  ('form.referral_ads', 'de', 'Werbung', 'general'),
  ('form.referral_other', 'de', 'Sonstiges', 'general'),
  ('error.referral_required', 'de', 'Bitte geben Sie an, wie Sie von uns erfahren haben', 'general'),

  ('form.referral_placeholder', 'uk', 'Звiдки дiзналися про нас? *', 'general'),
  ('form.referral_google', 'uk', 'Пошук в Google', 'general'),
  ('form.referral_social', 'uk', 'Соцiальнi мережi', 'general'),
  ('form.referral_recommendation', 'uk', 'Рекомендацiя', 'general'),
  ('form.referral_ads', 'uk', 'Реклама', 'general'),
  ('form.referral_other', 'uk', 'Iнше', 'general'),
  ('error.referral_required', 'uk', 'Будь ласка, вкажiть звiдки ви дiзналися про нас', 'general'),

  ('form.referral_placeholder', 'zh', '您是如何了解我们的？*', 'general'),
  ('form.referral_google', 'zh', 'Google搜索', 'general'),
  ('form.referral_social', 'zh', '社交媒体', 'general'),
  ('form.referral_recommendation', 'zh', '推荐', 'general'),
  ('form.referral_ads', 'zh', '广告', 'general'),
  ('form.referral_other', 'zh', '其他', 'general'),
  ('error.referral_required', 'zh', '请选择您是如何了解我们的', 'general')
ON CONFLICT DO NOTHING;