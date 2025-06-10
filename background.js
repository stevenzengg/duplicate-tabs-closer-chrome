let isEnabled = true;

function preloadOpenTabs() {
  chrome.tabs.query({}, (tabs) => {
    const openTabs = {};
    for (const tab of tabs) {
      if (tab.url && isHttpUrl(tab.url)) {
        openTabs[tab.id] = new URL(tab.url).href;
      }
    }
    chrome.storage.local.set({ openTabs });
  });
}

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("enabled", (data) => {
    isEnabled = data.enabled !== false;
    if (isEnabled) {
      preloadOpenTabs();
    } else {
      chrome.storage.local.set({ openTabs: {} });
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("enabled", (data) => {
    isEnabled = data.enabled !== false;
    if (isEnabled) {
      preloadOpenTabs();
    } else {
      chrome.storage.local.set({ openTabs: {} });
    }
  });
});

chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.url || !isHttpUrl(tab.url) || !isEnabled) return;

  const newUrl = new URL(tab.url).href;

  chrome.storage.local.get("openTabs", (data) => {
    const openTabs = data.openTabs || {};

    const existingTabId = Object.entries(openTabs).find(
      ([id, url]) => url === newUrl
    )?.[0];
    
    if (existingTabId) {
      chrome.tabs.get(parseInt(existingTabId), (existingTab) => {
        if (chrome.runtime.lastError || !existingTab) return;
        chrome.tabs.remove(tab.id);

        chrome.windows.update(existingTab.windowId, { focused: true });
        chrome.tabs.update(existingTab.id, { active: true });
    
      });
    } else {
      openTabs[tab.id] = newUrl;
      chrome.storage.local.set({ openTabs });
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get("openTabs", (data) => {
    const openTabs = data.openTabs || {};
    if (openTabs[tabId]) {
      delete openTabs[tabId];
      chrome.storage.local.set({ openTabs });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && isHttpUrl(changeInfo.url) && isEnabled) {
    const newUrl = new URL(changeInfo.url).href;

    chrome.storage.local.get("openTabs", (data) => {
      const openTabs = data.openTabs || {};

      const existingTabId = Object.entries(openTabs).find(
        ([id, url]) => url === newUrl && Number(id) !== tabId
      )?.[0];
      
      if (existingTabId) {
        chrome.tabs.get(parseInt(existingTabId), (existingTab) => {
          if (chrome.runtime.lastError || !existingTab) return;
      
          chrome.windows.update(existingTab.windowId, { focused: true });
          chrome.tabs.update(existingTab.id, { active: true });
      
          chrome.tabs.remove(tabId);
        });
      } else {
        openTabs[tabId] = newUrl;
        chrome.storage.local.set({ openTabs });
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
    chrome.storage.local.set({ enabled: isEnabled }, () => {
      if (isEnabled) {
        preloadOpenTabs();
      } else {
        chrome.storage.local.set({ openTabs: {} });
      }
      sendResponse({ success: true });
    });
    return true; // Indicates async response
  }
});
preloadOpenTabs();
