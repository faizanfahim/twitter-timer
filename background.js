// Default settings
const DEFAULT_SETTINGS = {
  timerDuration: 120,
  websites: [
    'x.com',
    'twitter.com',
    'linkedin.com',
    'reddit.com'
  ]
};

// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    }
  });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    chrome.storage.sync.get(['settings', 'activeMissions'], (result) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      const activeMissions = result.activeMissions || {};
      
      // Check if URL matches any website in the list
      const shouldIntercept = settings.websites.some((site) => {
        const normalizedSite = site.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
        const normalizedUrl = tab.url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
        return normalizedUrl.includes(normalizedSite) || normalizedSite.includes(normalizedUrl.split('/')[0]);
      });
      
      if (shouldIntercept && !activeMissions[tabId]) {
        // Content script will handle showing the overlay
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).catch(() => {
          // Script might already be injected, that's ok
        });
      }
    });
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.sync.get(['activeMissions'], (result) => {
    const activeMissions = result.activeMissions || {};
    if (activeMissions[tabId]) {
      delete activeMissions[tabId];
      chrome.storage.sync.set({ activeMissions });
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabId') {
    sendResponse({ tabId: sender.tab?.id });
  } else if (request.action === 'startMission') {
    const tabId = sender.tab?.id;
    if (tabId) {
      chrome.storage.sync.get(['activeMissions'], (result) => {
        const activeMissions = result.activeMissions || {};
        activeMissions[tabId] = {
          mission: request.mission,
          startTime: Date.now(),
          duration: request.duration,
          url: request.url
        };
        chrome.storage.sync.set({ activeMissions });
      });
    }
    sendResponse({ success: true });
  } else if (request.action === 'completeMission') {
    const tabId = sender.tab?.id;
    if (tabId) {
      chrome.storage.sync.get(['activeMissions'], (result) => {
        const activeMissions = result.activeMissions || {};
        delete activeMissions[tabId];
        chrome.storage.sync.set({ activeMissions });
      });
      // Close the tab
      chrome.tabs.remove(tabId);
    }
    sendResponse({ success: true });
  } else if (request.action === 'timeUp') {
    const tabId = sender.tab?.id;
    if (tabId) {
      chrome.storage.sync.get(['activeMissions'], (result) => {
        const activeMissions = result.activeMissions || {};
        delete activeMissions[tabId];
        chrome.storage.sync.set({ activeMissions });
      });
      // Close the tab
      chrome.tabs.remove(tabId);
    }
    sendResponse({ success: true });
  }
  return true;
});
