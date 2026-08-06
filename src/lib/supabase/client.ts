import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tvrkglakafzmsyrgcynk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
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
