import os
import time
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from the root .env file
load_dotenv(dotenv_path='../../../.env')

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file.")
    exit(1)

supabase: Client = create_client(url, key)

def test_supabase():
    print(f"Testing Supabase connection (Python)...")
    print(f"Project URL: {url}")

    # Test insert
    mock_word = f"ephemeral_{int(time.time())}"
    test_entry = {
        "target_word": mock_word,
        "context_sentence": "The beauty of a sunset is purely ephemeral.",
        "source_url": "http://test-py.com",
        "translation": "phù du",
        "part_of_speech": "adjective",
        "example_sentence": "Fame is often ephemeral.",
        "word_context_hash": f"hash_py_{int(time.time())}",
        "learning_state": "new"
    }

    print("\n1. Inserting test record...")
    try:
        # Note: supabase-py uses common methods like from_() and insert()
        response = supabase.table("vocabulary").insert(test_entry).execute()
        
        insert_data = response.data
        if not insert_data:
            print("❌ Insert failed: No data returned.")
            return

        print(f"✅ Insert successful: {insert_data[0]['id']}")

        # Test fetch
        print("\n2. Fetching records...")
        fetch_response = supabase.table("vocabulary").select("*").limit(5).execute()
        fetch_data = fetch_response.data
        
        print(f"✅ Fetch successful. Found {len(fetch_data)} records.")

        # Test delete (cleanup)
        print("\n3. Cleaning up test record...")
        delete_response = supabase.table("vocabulary").delete().eq("id", insert_data[0]["id"]).execute()
        
        print("✅ Cleanup successful.")
        print("\n🎉 All Supabase Python tests passed!")

    except Exception as e:
        print(f"\n❌ Supabase test failed: {str(e)}")

if __name__ == "__main__":
    test_supabase()
