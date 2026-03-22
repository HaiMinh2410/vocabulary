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

/**
 * Sends capture data to the local Python Backend.
 * @param {Object} payload 
 */
async function processCapture(payload) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ backendUrl: 'http://127.0.0.1:8000' }, async (items) => {
      try {
        const url = `${items.backendUrl}/api/v1/capture`;
        console.log('Forwarding capture to Python Backend:', url);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const detail = await response.text();
          throw new Error(`Backend Error: ${response.status} - ${detail}`);
        }

        const result = await response.json();
        console.log('Capture successful via Backend:', result);
        resolve(result.data);

      } catch (error) {
        console.error('Extension Backend Error:', error);
        reject(error);
      }
    });
  });
}
