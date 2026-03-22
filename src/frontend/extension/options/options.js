// Save options to chrome.storage
const saveOptions = () => {
  const backendUrl = document.getElementById('backendUrl').value.trim() || 'http://127.0.0.1:8000';

  chrome.storage.local.set(
    { backendUrl },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('statusMessage');
      status.textContent = 'Backend configuration saved!';
      status.className = 'status-msg status-success';
      setTimeout(() => {
        status.textContent = '';
      }, 3000);
    }
  );
};

// Restores select box and checkbox state using the preferences stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(
    { backendUrl: 'http://127.0.0.1:8000' },
    (items) => {
      document.getElementById('backendUrl').value = items.backendUrl;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);
