// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    // Lucide initialization removed


    // 2. Load stored settings (Chrome Storage)
    chrome.storage.local.get(['supabaseUrl', 'supabaseKey', 'userId', 'hfKey', 'hfModel'], (items) => {
        if (items.supabaseUrl) document.getElementById('supabaseUrl').value = items.supabaseUrl;
        if (items.supabaseKey) document.getElementById('supabaseKey').value = items.supabaseKey;
        if (items.userId) document.getElementById('userId').value = items.userId;
        if (items.hfKey) document.getElementById('hfKey').value = items.hfKey;
        if (items.hfModel) document.getElementById('hfModel').value = items.hfModel;
    });
});

// Save settings to Chrome Storage
document.getElementById('saveBtn').addEventListener('click', () => {
    const supabaseUrl = document.getElementById('supabaseUrl').value.trim();
    const supabaseKey = document.getElementById('supabaseKey').value.trim();
    const userId = document.getElementById('userId').value.trim();
    const hfKey = document.getElementById('hfKey').value.trim();
    const hfModel = document.getElementById('hfModel').value.trim() || 'meta-llama/Meta-Llama-3-8B-Instruct';

    const statusMessage = document.getElementById('statusMessage');
    const statusIcon = document.getElementById('statusIcon');

    chrome.storage.local.set({
        supabaseUrl,
        supabaseKey,
        userId,
        hfKey,
        hfModel
    }, () => {
        // Updated premium status feedback
        statusMessage.textContent = 'Cài đặt đã được lưu thành công!';
        statusMessage.classList.add('text-emerald-500');
        statusIcon.classList.remove('hidden', 'animate-bounce');
        statusIcon.classList.add('inline-flex', 'animate-pulse');
        
        setTimeout(() => {
            statusMessage.textContent = '';
            statusIcon.classList.add('hidden');
        }, 3000);
    });
});
