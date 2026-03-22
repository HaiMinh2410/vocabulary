import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from the root .env file
load_dotenv(dotenv_path='../../../.env')

def test_llama():
    api_key = os.getenv('HUGGINGFACE_API_KEY')
    model = os.getenv('LLAMA_MODEL', 'meta-llama/Meta-Llama-3-8B-Instruct')
    # Hugging Face offers an OpenAI-compatible endpoint format
    endpoint = "https://router.huggingface.co/v1/chat/completions"

    if not api_key or 'xxxx' in api_key:
        print("❌ Missing valid HUGGINGFACE_API_KEY in .env file.")
        print("Please add your actual hf_... token to the .env file.")
        return

    print("--- Testing LLaMA API connection via Hugging Face (Python) ---")
    print(f"Endpoint: {endpoint}")
    print(f"Model: {model}")

    prompt = """You are a linguistic expert. Return a JSON object with: 
- translation (Vietnamese meaning of the word)
- part_of_speech 
- example_sentence

Word: "Serendipity"
Context: "It was pure serendipity that we met at the coffee shop."

Respond ONLY with valid JSON."""

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.1
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        
        if response.status_code != 200:
            print(f"❌ HTTP error! Status: {response.status_code} - {response.text}")
            return

        data = response.json()
        print("\n✅ LLaMA integration successful. Raw response:")
        
        # Parse the actual message content if it follows OpenAI format
        if "choices" in data and len(data["choices"]) > 0:
            content = data["choices"][0]["message"]["content"]
            print("\nParsed Output from AI:")
            print(content)
        else:
            print(json.dumps(data, indent=2))

    except Exception as e:
        print(f"\n❌ LLaMA API test failed: {str(e)}")

if __name__ == "__main__":
    test_llama()
