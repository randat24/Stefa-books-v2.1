import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Since we're not using authentication yet
  },
});

// Type-safe database types
export type Book = Database['public']['Tables']['books']['Row'];
export type BookInsert = Database['public']['Tables']['books']['Insert'];
export type BookUpdate = Database['public']['Tables']['books']['Update'];

export type Author = Database['public']['Tables']['authors']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type SearchQuery = Database['public']['Tables']['search_queries']['Row'];