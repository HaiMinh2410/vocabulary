# Project Constitution (gemini.md)

## Data Schemas

### 1. Capture Payload (Content Script -> Background Worker)
```json
{
  "target_word": "string",
  "context_sentence": "string",
  "source_url": "string"
}
```

### 2. AI Enrichment Payload (LLaMA API Output)
```json
{
  "translation": "string",
  "part_of_speech": "string",
  "example_sentence": "string"
}
```

### 3. Supabase Vocabulary Entry (Source of Truth)
```json
{
  "id": "uuid (Primary Key)",
  "user_id": "uuid (Foreign Key to Auth)",
  "target_word": "string",
  "context_sentence": "string",
  "source_url": "string",
  "translation": "string",
  "part_of_speech": "string",
  "example_sentence": "string",
  "word_context_hash": "string (Unique constraint for deduplication)",
  "frequency": "integer (Default: 1)",
  "learning_state": "string (Enum: 'new', 'reviewed', 'mastered')",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Behavioral Rules
- **Core Identity:** The system is a learning OS, not a dictionary tool.
- **Tone:** clear, concise, and linguistically precise.
- **Always:**
  - Use sentence context to determine meaning.
  - Present information in a structured, minimal format.
  - Preserve the original source for traceability.
  - Treat each saved word as a reusable learning asset.
- **Never:**
  - Provide generic or context-free translations.
  - Overwhelm users with excessive linguistic data.
  - Break the capture → enrich → store flow.
  - Treat words as isolated units without context.

## Architectural Invariants
- **Source of Truth:** Supabase is the single source of truth. No data is considered valid until processed and stored in Supabase.
- **System Orchestration:** All views derive from Supabase. There are no authoritative secondary systems.
- **Non-blocking UX:** UI must not freeze during capture. Background service worker orchestrates API calls async.
- **Deduplication:** Enforce deduplication via word + context hash.
