// Save options to chrome.storage
const saveOptions = () => {
  const supabaseUrl = document.getElementById('supabaseUrl').value.trim();
  const supabaseKey = document.getElementById('supabaseKey').value.trim();
  const userId = document.getElementById('userId').value.trim();
  const hfKey = document.getElementById('hfKey').value.trim();
  const hfModel = document.getElementById('hfModel').value.trim();

  chrome.storage.local.set(
    { supabaseUrl, supabaseKey, userId, hfKey, hfModel },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('statusMessage');
      status.textContent = 'Settings saved successfully!';
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
    { supabaseUrl: '', supabaseKey: '', userId: '', hfKey: '', hfModel: 'meta-llama/Meta-Llama-3-8B-Instruct' },
    (items) => {
      document.getElementById('supabaseUrl').value = items.supabaseUrl;
      document.getElementById('supabaseKey').value = items.supabaseKey;
      document.getElementById('userId').value = items.userId;
      document.getElementById('hfKey').value = items.hfKey;
      document.getElementById('hfModel').value = items.hfModel;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveBtn').addEventListener('click', saveOptions);
