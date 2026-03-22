import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '@/lib/config';

const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseAnonKey = CONFIG.SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchVocabulary() {
    if (!supabase) {
        console.warn('Supabase client is not initialized. Check environment variables!');
        return [];
    }
    const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
}
