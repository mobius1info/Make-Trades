// Значения берутся из .env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
// Фолбэки оставлены, чтобы сборка не падала, если переменные не заданы в
// панели хостинга: URL и publishable key — публичные по своей природе,
// доступ к данным ограничен политиками RLS.
// VITE_SUPABASE_ANON_KEY хранит publishable key — новый аналог anon key.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gknfzfxjaeuvrncgljyi.supabase.co';
export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_kIrFfj1eE5XHGfpJ45V_WA__3nuvX5E';
