// Create the floating button once
let captureBtn = null;

function createCaptureButton() {
  if (captureBtn) return captureBtn;
  
  captureBtn = document.createElement('button');
  captureBtn.id = 'vocab-os-capture-btn';
  captureBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
    </svg>
    Capture
  `;
  captureBtn.style.display = 'none';
  document.body.appendChild(captureBtn);

  // Handle capture click
  captureBtn.addEventListener('mousedown', async (e) => {
    e.preventDefault(); // Prevent selection clearing
    e.stopPropagation();
    
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const targetWord = selection.toString().trim();
    if (!targetWord) return;

    // Extract context: get the text content of the node where the selection is
    const nodeText = selection.anchorNode.textContent || "";
    // Extremely basic sentence extraction around the target word
    const sentences = nodeText.match(/[^.!?]+[.!?]+/g) || [nodeText];
    let contextSentence = sentences.find(s => s.includes(targetWord)) || targetWord;
    contextSentence = contextSentence.trim();

    // Visual feedback
    setButtonState('loading', 'Capturing...');

    // Send to background worker
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CAPTURE_WORD',
        payload: {
          target_word: targetWord,
          context_sentence: contextSentence,
          source_url: window.location.href
        }
      });

      if (response && response.success) {
        setButtonState('success', 'Saved!');
      } else {
        setButtonState('error', 'Failed');
        console.error('Vocabulary OS Capture Error:', response?.error);
      }
    } catch (err) {
      setButtonState('error', 'Error');
      console.error('Vocabulary OS Capture Error:', err);
    }

    // Hide button after a delay
    setTimeout(() => {
      captureBtn.style.display = 'none';
      setButtonState('default', 'Capture');
      selection.removeAllRanges();
    }, 2000);
  });

  return captureBtn;
}

function setButtonState(state, text) {
  if (!captureBtn) return;
  captureBtn.className = ''; // reset classes
  if (state !== 'default') captureBtn.classList.add(state);
  
  // Keep the SVG icon for default state
  if (state === 'default') {
    captureBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
      Capture`;
  } else {
    captureBtn.innerText = text;
  }
}

// Listen for selection changes to show/hide the button
document.addEventListener('mouseup', (e) => {
  // Ignore clicks on the button itself
  if (e.target.closest('#vocab-os-capture-btn')) return;

  const btn = createCaptureButton();
  
  // Use a small timeout to let the browser finish selection metrics
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0 && text.length < 50 && text.split(' ').length <= 4) {
      // Show button if a small word/phrase is selected
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Position above the selection
      btn.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 40}px`;
      btn.style.top = `${rect.top + window.scrollY - 40}px`;
      btn.style.display = 'flex';
      setButtonState('default', 'Capture');
    } else {
      btn.style.display = 'none';
    }
  }, 10);
});
