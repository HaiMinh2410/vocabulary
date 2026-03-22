// Utility for simple hashing
async function generateHash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CAPTURE_WORD') {
    // Process async and keep the message channel open
    processCapture(request.payload)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    
    return true; // Indicates asynchronous response
  }
});

async function processCapture(payload) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(
      ['supabaseUrl', 'supabaseKey', 'userId', 'hfKey', 'hfModel'],
      async (keys) => {
        try {
          if (!keys.hfKey || !keys.supabaseUrl || !keys.supabaseKey) {
            throw new Error('API keys missing. Please configure them in the Extension Options.');
          }

          // 1. Call Hugging Face API
          console.log('Orchestrating AI for:', payload.target_word);
          const aiData = await callHuggingFace(payload, keys.hfKey, keys.hfModel);

          // 2. Prepare Supabase Payload
          const hashString = payload.target_word.toLowerCase() + '|' + payload.context_sentence;
          const wordContextHash = await generateHash(hashString);

          const dbPayload = {
            target_word: payload.target_word,
            context_sentence: payload.context_sentence,
            source_url: payload.source_url,
            translation: aiData.translation || '',
            part_of_speech: aiData.part_of_speech || '',
            example_sentence: aiData.example_sentence || '',
            word_context_hash: wordContextHash,
            learning_state: 'new',
            frequency: 1
          };

          if (keys.userId) {
            dbPayload.user_id = keys.userId;
          }

          // 3. Insert into Supabase
          await insertToSupabase(dbPayload, keys.supabaseUrl, keys.supabaseKey);

          resolve(dbPayload);

        } catch (error) {
          console.error('Background Worker Error:', error);
          reject(error);
        }
      }
    );
  });
}

async function callHuggingFace(payload, apiKey, modelName) {
  const endpoint = `https://router.huggingface.co/v1/chat/completions`;
  const prompt = `You are a linguistic expert. Return a JSON object with: 
- translation (Vietnamese meaning of the word)
- part_of_speech 
- example_sentence

Word: "${payload.target_word}"
Context: "${payload.context_sentence}"

Respond ONLY with valid JSON.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName || 'meta-llama/Meta-Llama-3-8B-Instruct',
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    throw new Error(`HF API Error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;
  
  // Safely parse JSON from potentially markdown-wrapped responses
  let jsonStr = rawContent;
  const match = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    jsonStr = match[1];
  }
  
  return JSON.parse(jsonStr.trim());
}

async function insertToSupabase(dbPayload, supabaseUrl, supabaseKey) {
  const endpoint = `${supabaseUrl}/rest/v1/vocabulary?on_conflict=word_context_hash`;
  
  // We use ON CONFLICT DO UPDATE to handle deduplication seamlessly
  // However, Supabase REST API requires 'Prefer: resolution=merge-duplicates' for UPSERT.
  // We use return=representation to ensure we always get a body back to avoid 'Unexpected end of JSON input'
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    body: JSON.stringify(dbPayload)
  });

  if (!response.ok) {
    throw new Error(`Supabase Error: ${response.status} ${await response.text()}`);
  }
  
  // PostgREST might return 201 Created or 204 No Content for upsert.
  // Always safe check the text before parsing
  const responseText = await response.text();
  if (!responseText || responseText.trim().length === 0) return null;
  return JSON.parse(responseText);
}
