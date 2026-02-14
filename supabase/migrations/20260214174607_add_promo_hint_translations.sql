/*
  # Add promo hint translations

  1. New translations
    - `form.promo_badge` - Badge text "-50%"
    - `form.promo_text` - Promo message for all 5 languages (ru, en, de, uk, zh)
*/

INSERT INTO translations (key, language, value, category) VALUES
  ('form.promo_badge', 'ru', '-50%', 'form'),
  ('form.promo_badge', 'en', '-50%', 'form'),
  ('form.promo_badge', 'de', '-50%', 'form'),
  ('form.promo_badge', 'uk', '-50%', 'form'),
  ('form.promo_badge', 'zh', '-50%', 'form'),
  ('form.promo_text', 'ru', 'Напишите нам напрямую на <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> и получите <strong>скидку 50% на установку</strong> софта + бонусную неделю вне учёта аренды для настройки с нашей техподдержкой', 'form'),
  ('form.promo_text', 'en', 'Email us directly at <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> and get <strong>50% off installation</strong> + a free bonus week outside rental billing to set up the software with our tech support', 'form'),
  ('form.promo_text', 'de', 'Schreiben Sie uns direkt an <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> und erhalten Sie <strong>50% Rabatt auf die Installation</strong> + eine kostenlose Bonuswoche ausserhalb der Mietabrechnung zur Einrichtung mit unserem technischen Support', 'form'),
  ('form.promo_text', 'uk', 'Напишіть нам напряму на <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> та отримайте <strong>знижку 50% на встановлення</strong> софту + бонусний тиждень поза обліком оренди для налаштування з нашою техпідтримкою', 'form'),
  ('form.promo_text', 'zh', '直接发送邮件至 <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> 即可享受<strong>安装费5折优惠</strong> + 额外赠送一周免租期，由我们的技术支持团队协助您进行软件配置', 'form')
ON CONFLICT DO NOTHING;