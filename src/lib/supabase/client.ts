import { createBrowserClient } from '@supabase/ssr';

const cleanUrl = (url?: string) => (url ? url.replace(/['"]/g, '').trim() : '');
const cleanKey = (key?: string) => (key ? key.replace(/['"]/g, '').trim() : '');

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://glnygxwnmxngkreyizjm.supabase.co';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabaseUrl = cleanUrl(rawUrl);
const supabaseAnonKey = cleanKey(rawKey);

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    supabaseAnonKey &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const createClient = () => {
  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null as any;
  }
};
