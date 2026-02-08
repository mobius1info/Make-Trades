-- Инструкция по созданию первого администратора
--
-- ВАЖНО: Сначала создайте пользователя через Supabase Dashboard:
-- 1. Откройте Supabase Dashboard
-- 2. Перейдите в Authentication > Users
-- 3. Нажмите "Add User" и создайте нового пользователя с email и паролем
-- 4. Скопируйте UUID пользователя из колонки "UID"
-- 5. Замените 'YOUR_USER_ID_HERE' ниже на скопированный UUID
-- 6. Замените 'admin@example.com' на email созданного пользователя
-- 7. Выполните этот скрипт в SQL Editor

INSERT INTO admin_users (id, email, role)
VALUES (
  'YOUR_USER_ID_HERE',     -- Замените на UID из auth.users
  'admin@example.com',     -- Замените на email администратора
  'admin'
);

-- После выполнения вы сможете войти в админ-панель по адресу:
-- https://ваш-сайт.com/admin.html
-- используя email и пароль созданного пользователя
