/*
  # Add form notice translations

  1. New translations
    - `form.notice_text` in all 5 languages (ru, en, de, uk, zh)
    - Explains that MakeTrades is a technology platform providing brokerage software
      for rent with full technical support, not a broker itself
*/

INSERT INTO translations (key, language, value) VALUES
  ('form.notice_text', 'ru', 'Мы не брокер. MakeTrades — это технологическая платформа: мы предоставляем профессиональный софт для запуска брокерского бизнеса в аренду с полным техническим сопровождением и поддержкой 24/7.'),
  ('form.notice_text', 'en', 'We are not a broker. MakeTrades is a technology platform: we provide professional software for launching a brokerage business for rent, with full technical support and 24/7 assistance.'),
  ('form.notice_text', 'de', 'Wir sind kein Broker. MakeTrades ist eine Technologieplattform: Wir bieten professionelle Software zur Miete fur den Start eines Brokerage-Geschafts mit umfassendem technischen Support und 24/7-Betreuung.'),
  ('form.notice_text', 'uk', 'Ми не брокер. MakeTrades — це технологічна платформа: ми надаємо професійний софт для запуску брокерського бізнесу в оренду з повним технічним супроводом та підтримкою 24/7.'),
  ('form.notice_text', 'zh', '我们不是经纪商。MakeTrades 是一个技术平台：我们提供专业的经纪业务软件租赁服务，配备全面的技术支持和全天候客服。')
ON CONFLICT (key, language) DO UPDATE SET value = EXCLUDED.value, updated_at = now();