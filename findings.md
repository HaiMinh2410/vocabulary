# Findings

*2026-03-21*
- **Architecture Formulated:** The application comprises a Browser Extension (Context Menu & Content Script), a Background Service Worker, LLaMA API for linguistics, and Supabase for DB/Auth.
- **Data Flow:** Capture → Process → Store → Review → Reinforce.
- **Key Constraints:** 
  - Ensure selection length isn't too long.
  - Normalize whitespace/punctuation on capture.
  - Extension UI should be virtually invisible during capture but powerful in the Review Layer.
  - **Supabase UPSERT**: Using `Prefer: resolution=merge-duplicates,return=representation` alongside `?on_conflict=word_context_hash` is the most reliable way to handle deduplication in logic-heavy browser extensions.
- **Chrome Extension V3**: Background service workers require careful handling of asynchronous `chrome.storage` lookups to avoid race conditions during API orchestration.
- **LLM Context Extraction**: Simple regex context extraction works well for sentences, but robust DOM traversal is needed for complex web page structures.
- **Icon Requirements**: Chrome V3 is strict about declared assets. Missing icons will prevent the extension from loading entirely.
- **Safe JSON Parsing**: Always read `response.text()` before `JSON.parse()` when dealing with external REST APIs to handle `204 No Content` or malformed responses gracefully.
