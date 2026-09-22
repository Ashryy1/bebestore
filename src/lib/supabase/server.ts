import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function isSupabaseServerConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  );
}

export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !url.startsWith('http')) {
    console.warn(
      '⚠️ Supabase credentials not found in NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.'
    );
    return createClient<Database>(
      'https://placeholder-project.supabase.co',
      'placeholder-key',
      { auth: { persistSession: false } }
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
    },
  });
}
