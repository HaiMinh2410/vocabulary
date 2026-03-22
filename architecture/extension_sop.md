# Extension Architecture SOP

## 1. Core Components
- **`manifest.json`** (Manifest V3): Defines permissions (`activeTab`, `scripting`, `contextMenus`, `storage`) and registers the background worker, content scripts, and options/popup pages.
- **`content.js`**: Injected into web pages. Listens for user text selection and presents a minimal UI mechanism (e.g., a small floating button next to selection) to trigger "Capture".
- **`background.js`**: The orchestrator. Receives capture requests from `content.js`, manages configuration states, makes API calls to Hugging Face and Supabase, and stores the linguistic result asynchronously.
- **`options/options.html`**: A configuration page allowing the user to set their API Keys without hardcoding them into the codebase.

## 2. Capture Data Flow
1. User highlights text on an active web page.
2. `content.js` detects the selection, extracts the `target_word`, surrounding sentence as `context_sentence`, and the `source_url`.
3. `content.js` shows a floating action button near the cursor.
4. User clicks "Capture" -> `content.js` sends message `CAPTURE_WORD` to `background.js`.
5. `background.js` immediately acknowledges the message, allowing `content.js` to show a "Loading" state seamlessly.
6. `background.js` retrieves API keys from `chrome.storage.local`.
7. `background.js` calls Hugging Face API to get the structured linguistic data (`translation`, `part_of_speech`, `example_sentence`).
8. `background.js` validates the JSON response.
9. `background.js` merges the original Capture Payload + AI Payload, generates the `word_context_hash`, and pushes to Supabase.
10. `background.js` sends a message back to `content.js` to update the floating UI tooltip to a "Success" state.

## 3. Invariants Checklist
- [ ] Ensure non-blocking UX: Do not freeze the current page while awaiting HTTP requests.
- [ ] Source of Truth: Data is only considered "saved" when Supabase confirms the insertion.
- [ ] Granular Context Extraction: The captured sentence should be trimmed but retain the semantic context necessary for accurate AI translation.
