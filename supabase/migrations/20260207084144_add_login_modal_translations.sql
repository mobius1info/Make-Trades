/*
  # Add login modal translations

  1. New Translations
    - `login.title` - Login modal title for all 5 languages
    - `login.email` - Email placeholder for all 5 languages
    - `login.password` - Password placeholder for all 5 languages
    - `login.button` - Login button text for all 5 languages
    - `error.login_invalid` - Invalid credentials error for all 5 languages
    - `error.login_email_required` - Email required error for all 5 languages
    - `error.login_password_required` - Password required error for all 5 languages
    - `error.login_email_invalid` - Invalid email format error for all 5 languages

  2. Purpose
    - Support localized login modal with inline red error messages
*/

INSERT INTO translations (key, language, value, category) VALUES
  ('login.title', 'ru', 'Вход в личный кабинет', 'login'),
  ('login.title', 'en', 'Sign In', 'login'),
  ('login.title', 'de', 'Anmelden', 'login'),
  ('login.title', 'uk', 'Вхід до особистого кабінету', 'login'),
  ('login.title', 'zh', '登录个人账户', 'login'),

  ('login.email', 'ru', 'Email', 'login'),
  ('login.email', 'en', 'Email', 'login'),
  ('login.email', 'de', 'E-Mail', 'login'),
  ('login.email', 'uk', 'Email', 'login'),
  ('login.email', 'zh', '电子邮件', 'login'),

  ('login.password', 'ru', 'Пароль', 'login'),
  ('login.password', 'en', 'Password', 'login'),
  ('login.password', 'de', 'Passwort', 'login'),
  ('login.password', 'uk', 'Пароль', 'login'),
  ('login.password', 'zh', '密码', 'login'),

  ('login.button', 'ru', 'Войти', 'login'),
  ('login.button', 'en', 'Log In', 'login'),
  ('login.button', 'de', 'Einloggen', 'login'),
  ('login.button', 'uk', 'Увійти', 'login'),
  ('login.button', 'zh', '登录', 'login'),

  ('error.login_invalid', 'ru', 'Неверный email или пароль', 'login'),
  ('error.login_invalid', 'en', 'Invalid email or password', 'login'),
  ('error.login_invalid', 'de', 'Ungültige E-Mail oder Passwort', 'login'),
  ('error.login_invalid', 'uk', 'Невірний email або пароль', 'login'),
  ('error.login_invalid', 'zh', '邮箱或密码错误', 'login'),

  ('error.login_email_required', 'ru', 'Пожалуйста, введите email', 'login'),
  ('error.login_email_required', 'en', 'Please enter your email', 'login'),
  ('error.login_email_required', 'de', 'Bitte geben Sie Ihre E-Mail ein', 'login'),
  ('error.login_email_required', 'uk', 'Будь ласка, введіть email', 'login'),
  ('error.login_email_required', 'zh', '请输入电子邮件', 'login'),

  ('error.login_password_required', 'ru', 'Пожалуйста, введите пароль', 'login'),
  ('error.login_password_required', 'en', 'Please enter your password', 'login'),
  ('error.login_password_required', 'de', 'Bitte geben Sie Ihr Passwort ein', 'login'),
  ('error.login_password_required', 'uk', 'Будь ласка, введіть пароль', 'login'),
  ('error.login_password_required', 'zh', '请输入密码', 'login'),

  ('error.login_email_invalid', 'ru', 'Пожалуйста, введите корректный email', 'login'),
  ('error.login_email_invalid', 'en', 'Please enter a valid email address', 'login'),
  ('error.login_email_invalid', 'de', 'Bitte geben Sie eine gültige E-Mail ein', 'login'),
  ('error.login_email_invalid', 'uk', 'Будь ласка, введіть коректний email', 'login'),
  ('error.login_email_invalid', 'zh', '请输入有效的电子邮件地址', 'login')
ON CONFLICT DO NOTHING;