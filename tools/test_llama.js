require('dotenv').config({ path: '../.env' });

async function testLlama() {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const model = process.env.LLAMA_MODEL || 'meta-llama/Meta-Llama-3-8B-Instruct';
  // Hugging Face offers an OpenAI-compatible endpoint format
  const endpoint = `https://router.huggingface.co/v1/chat/completions`;

  if (!apiKey || apiKey.includes('xxxxxxxx')) {
    console.error('❌ Missing valid HUGGINGFACE_API_KEY in .env file.');
    console.log('Please add your actual hf_... token to the .env file.');
    return;
  }

  console.log('Testing LLaMA API connection via Hugging Face...');
  console.log('Endpoint:', endpoint);
  console.log('Model:', model);

  const prompt = `You are a linguistic expert. Return a JSON object with: 
- translation (Vietnamese meaning of the word)
- part_of_speech 
- example_sentence

Word: "Serendipity"
Context: "It was pure serendipity that we met at the coffee shop."

Respond ONLY with valid JSON.`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "user", content: prompt }
        ],
        // Note: Not all HF models fully support response_format: { type: "json_object" } natively in serverless,
        // so we prompt it strongly to just return JSON.
        max_tokens: 500,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    console.log('\n✅ LLaMA integration successful. Raw response:');
    
    // Parse the actual message content if it follows OpenAI format
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      console.log('\nParsed Output from AI:');
      console.log(content);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('\n❌ LLaMA API test failed:', error.message);
  }
}

testLlama();
