let activeTabId = null;
let activeTabUrl = null;
let activeStartTime = null;
const timeSpent = {};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    handleTabChange(tab);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    handleTabChange(null);
  } else {
    const tabs = await chrome.tabs.query({ active: true, windowId: windowId });
    handleTabChange(tabs[0]);
  }
});

function handleTabChange(tab) {
  const currentTime = new Date().getTime();
  if (activeTabId !== null && activeStartTime !== null) {
    const duration = currentTime - activeStartTime;
    if (activeTabUrl) {
      if (!timeSpent[activeTabUrl]) {
        timeSpent[activeTabUrl] = 0;
      }
      timeSpent[activeTabUrl] += duration;
    }
  }

  if (tab && tab.id !== undefined) {
    activeTabId = tab.id;
    activeTabUrl = new URL(tab.url).hostname;
    activeStartTime = currentTime;
  } else {
    activeTabId = null;
    activeTabUrl = null;
    activeStartTime = null;
  }

  chrome.storage.local.set({ timeSpent });
}
