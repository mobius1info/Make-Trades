import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gknfzfxjaeuvrncgljyi.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbmZ6ZnhqYWV1dnJuY2dsanlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzMwNjEsImV4cCI6MjA4NjE0OTA2MX0.rZoKwEl9nbE4KLh3J5MZM5FfbdtCxOJGXTSTCe9VEds';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
