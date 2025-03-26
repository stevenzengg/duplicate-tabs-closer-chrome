let isEnabled = true;

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.session.set({ openTabs: {} });
  chrome.storage.local.get("enabled", (data) => {
    isEnabled = data.enabled !== false;
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("enabled", (data) => {
    isEnabled = data.enabled !== false;
  });
});

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.url || !isHttpUrl(tab.url) || !isEnabled) return;

  const newUrl = new URL(tab.url).href;

  chrome.storage.session.get("openTabs", (data) => {
    const openTabs = data.openTabs || {};

    const isDuplicate = Object.values(openTabs).includes(newUrl);

    if (isDuplicate) {
      chrome.tabs.remove(tab.id);  // Close the new duplicate tab
    } else {
      openTabs[tab.id] = newUrl;
      chrome.storage.session.set({ openTabs });
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.get("openTabs", (data) => {
    const openTabs = data.openTabs || {};
    if (openTabs[tabId]) {
      delete openTabs[tabId];
      chrome.storage.session.set({ openTabs });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && isHttpUrl(changeInfo.url) && isEnabled) {
    const newUrl = new URL(changeInfo.url).href;

    chrome.storage.session.get("openTabs", (data) => {
      const openTabs = data.openTabs || {};

      const isDuplicate = Object.entries(openTabs).some(
        ([id, url]) => url === newUrl && Number(id) !== tabId
      );

      if (isDuplicate) {
        chrome.tabs.remove(tab.id);  // Close the new tab trying to load a duplicate
      } else {
        openTabs[tabId] = newUrl;
        chrome.storage.session.set({ openTabs });
      }
    });
  }
});

function isHttpUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.toggle !== undefined) {
    isEnabled = request.toggle;
    chrome.storage.local.set({ enabled: isEnabled });
    sendResponse({ success: true });
  }
});