// Значения по умолчанию. Публичны по своей природе: URL проекта и publishable
// key видны в любом клиентском бандле, доступ ограничен политиками RLS.
// Из этих же констант читает значения scripts/seo-build.mjs при сборке —
// если переименовывать, поправить и там.
const DEFAULT_SUPABASE_URL = 'https://gknfzfxjaeuvrncgljyi.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_kIrFfj1eE5XHGfpJ45V_WA__3nuvX5E';

// Значение переменной окружения легко испортить при вставке в панель хостинга:
// потерять https://, прихватить пробел, кавычки или скопировать замаскированное
// значение вместо настоящего. Негодное значение молча ломало бы все запросы
// к базе, поэтому проверяем его и откатываемся на константу выше.
function resolveSupabaseUrl(value: unknown): string {
  const trimmed = String(value ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed) return DEFAULT_SUPABASE_URL;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withScheme);
    if (!parsed.hostname.includes('.')) return DEFAULT_SUPABASE_URL;
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

export const supabaseUrl = resolveSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const supabaseAnonKey =
  String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim() || DEFAULT_SUPABASE_ANON_KEY;
