/*
  # Update promo hint text - add telegram mention

  1. Modified translations
    - `form.promo_text` for all 5 languages - added "or via Telegram" to the promo message
*/

UPDATE translations SET value = 'Напишите нам напрямую на <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> или в телеграмм и получите <strong>скидку 50% на установку</strong> софта + бонусную неделю вне учёта аренды для настройки с нашей техподдержкой', updated_at = now() WHERE key = 'form.promo_text' AND language = 'ru';

UPDATE translations SET value = 'Email us at <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> or via Telegram and get <strong>50% off installation</strong> + a free bonus week outside rental billing to set up the software with our tech support', updated_at = now() WHERE key = 'form.promo_text' AND language = 'en';

UPDATE translations SET value = 'Schreiben Sie uns an <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> oder per Telegram und erhalten Sie <strong>50% Rabatt auf die Installation</strong> + eine kostenlose Bonuswoche ausserhalb der Mietabrechnung zur Einrichtung mit unserem technischen Support', updated_at = now() WHERE key = 'form.promo_text' AND language = 'de';

UPDATE translations SET value = 'Напишіть нам на <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> або в телеграм та отримайте <strong>знижку 50% на встановлення</strong> софту + бонусний тиждень поза обліком оренди для налаштування з нашою техпідтримкою', updated_at = now() WHERE key = 'form.promo_text' AND language = 'uk';

UPDATE translations SET value = '发送邮件至 <a href="mailto:sales@maketrades.space">sales@maketrades.space</a> 或通过Telegram联系我们，即可享受<strong>安装费5折优惠</strong> + 额外赠送一周免租期，由我们的技术支持团队协助您进行软件配置', updated_at = now() WHERE key = 'form.promo_text' AND language = 'zh';