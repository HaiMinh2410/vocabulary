document.addEventListener('DOMContentLoaded', () => {
    // Lucide initialization removed


    document.getElementById('openDashboard').addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:3000' }); // URL to the Next.js app
    });

    document.getElementById('openOptions').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
