import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? FALLBACK_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? FALLBACK_KEY
);
