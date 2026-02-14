/*
  # Fix Russian translations stored in non-Russian languages

  1. Problem
    - 4 translation keys have Russian values in EN, DE, UK, ZH languages:
      - button.login
      - button.request_demo
      - pricing.from
      - pricing.period

  2. Changes
    - Update EN translations to English
    - Update DE translations to German
    - Update UK translations to Ukrainian
    - Update ZH translations to Chinese
*/

UPDATE translations SET value = 'Personal Account' WHERE language = 'en' AND key = 'button.login';
UPDATE translations SET value = 'Request Demo Account' WHERE language = 'en' AND key = 'button.request_demo';
UPDATE translations SET value = 'From' WHERE language = 'en' AND key = 'pricing.from';
UPDATE translations SET value = 'per month' WHERE language = 'en' AND key = 'pricing.period';

UPDATE translations SET value = 'Persönliches Konto' WHERE language = 'de' AND key = 'button.login';
UPDATE translations SET value = 'Demo-Konto anfordern' WHERE language = 'de' AND key = 'button.request_demo';
UPDATE translations SET value = 'Ab' WHERE language = 'de' AND key = 'pricing.from';
UPDATE translations SET value = 'pro Monat' WHERE language = 'de' AND key = 'pricing.period';

UPDATE translations SET value = 'Особистий кабiнет' WHERE language = 'uk' AND key = 'button.login';
UPDATE translations SET value = 'Запросити демо-акаунт' WHERE language = 'uk' AND key = 'button.request_demo';
UPDATE translations SET value = 'Вiд' WHERE language = 'uk' AND key = 'pricing.from';
UPDATE translations SET value = 'на мiсяць' WHERE language = 'uk' AND key = 'pricing.period';

UPDATE translations SET value = '个人账户' WHERE language = 'zh' AND key = 'button.login';
UPDATE translations SET value = '申请演示账户' WHERE language = 'zh' AND key = 'button.request_demo';
UPDATE translations SET value = '起' WHERE language = 'zh' AND key = 'pricing.from';
UPDATE translations SET value = '每月' WHERE language = 'zh' AND key = 'pricing.period';
