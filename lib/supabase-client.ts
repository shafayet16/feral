import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);