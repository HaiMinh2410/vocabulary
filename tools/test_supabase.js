require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  console.log('Project URL:', process.env.SUPABASE_URL);

  // Test insert
  const mockWord = 'ephemeral_' + Date.now();
  const testEntry = {
    target_word: mockWord,
    context_sentence: 'The beauty of a sunset is purely ephemeral.',
    source_url: 'http://test.com',
    translation: 'phù du',
    part_of_speech: 'adjective',
    example_sentence: 'Fame is often ephemeral.',
    word_context_hash: 'hash_' + Date.now(),
    learning_state: 'new'
  };

  console.log('\n1. Inserting test record...');
  const { data: insertData, error: insertError } = await supabase
    .from('vocabulary')
    .insert([testEntry])
    .select();

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    return;
  }
  console.log('✅ Insert successful:', insertData[0].id);

  // Test fetch
  console.log('\n2. Fetching records...');
  const { data: fetchData, error: fetchError } = await supabase
    .from('vocabulary')
    .select('*')
    .limit(5);

  if (fetchError) {
    console.error('❌ Fetch failed:', fetchError);
    return;
  }
  console.log(`✅ Fetch successful. Found ${fetchData.length} records.`);
  
  // Test delete (cleanup)
  console.log('\n3. Cleaning up test record...');
  const { error: deleteError } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', insertData[0].id);

  if (deleteError) {
    console.error('❌ Cleanup failed:', deleteError);
  } else {
    console.log('✅ Cleanup successful.');
  }
    
  console.log('\n🎉 All Supabase tests passed!');
}

testSupabase();
