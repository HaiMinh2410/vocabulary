import os
import json
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from the root .env file
load_dotenv(dotenv_path='../../.env')

app = FastAPI(title="Vocabulary OS Backend", version="1.0.0")

# --- Initialize External Clients ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
LLAMA_MODEL = os.getenv("LLAMA_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")

if not all([SUPABASE_URL, SUPABASE_KEY, HF_API_KEY]):
    print("⚠️ WARNING: Missing some API keys in .env! Backend might not work correctly.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None

# --- Data Schemas ---
class CaptureRequest(BaseModel):
    target_word: str
    context_sentence: str
    source_url: str

# --- Helper Functions ---
def get_ai_enrichment(word: str, context: str):
    """Calls Hugging Face LLaMA API to get linguistic data."""
    endpoint = "https://router.huggingface.co/v1/chat/completions"
    prompt = f"""You are a linguistic expert. Return a JSON object with: 
- translation (Vietnamese meaning of the word)
- part_of_speech 
- example_sentence

Word: "{word}"
Context: "{context}"

Respond ONLY with valid JSON."""

    payload = {
        "model": LLAMA_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 500,
        "temperature": 0.1
    }
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}

    try:
        response = requests.post(endpoint, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"AI API Error: {response.text}")
        
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        # Basic cleanup in case AI adds markdown code blocks
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
    except Exception as e:
        print(f"Enrichment Error: {e}")
        return None

# --- Endpoints ---
@app.get("/")
async def root():
    return {"status": "online", "message": "Vocabulary OS Python Backend is running!"}

@app.post("/api/v1/capture")
async def capture_word(req: CaptureRequest):
    """
    Main flow: 
    1. Receive word from extension.
    2. Enrich with AI.
    3. Store in Supabase using the word_context_hash for deduplication.
    """
    if not HF_API_KEY or not supabase:
        raise HTTPException(status_code=500, detail="Backend not configured with API keys.")

    # 1. AI Enrichment
    ai_data = get_ai_enrichment(req.target_word, req.context_sentence)
    if not ai_data:
        raise HTTPException(status_code=502, detail="Failed to get AI enrichment.")

    # 2. Build Table Entry
    # Create hash for deduplication (word + context)
    import hashlib
    hash_input = f"{req.target_word.lower()}|{req.context_sentence.lower()}"
    word_context_hash = hashlib.md5(hash_input.encode()).hexdigest()

    entry = {
        "target_word": req.target_word,
        "context_sentence": req.context_sentence,
        "source_url": req.source_url,
        "translation": ai_data.get("translation", ""),
        "part_of_speech": ai_data.get("part_of_speech", ""),
        "example_sentence": ai_data.get("example_sentence", ""),
        "word_context_hash": word_context_hash,
        "learning_state": "new"
    }

    # 3. Store in Supabase
    try:
        # Upsert logic handling (depends on table constraints)
        result = supabase.table("vocabulary").upsert(entry, on_conflict="word_context_hash").execute()
        return {
            "success": True, 
            "data": result.data[0] if result.data else "Entry updated",
            "enriched": ai_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# To run: uvicorn main:app --reload
