import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '@/lib/config';

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

export async function fetchVocabulary() {
    const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
}
