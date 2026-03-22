document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    document.getElementById('openDashboard').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/frontend/dashboard/index.html') }); // Corrected path
    });

    document.getElementById('openOptions').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
