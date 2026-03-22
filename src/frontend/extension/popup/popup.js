document.getElementById('openDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/index.html') });
});

document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
