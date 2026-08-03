import { notifySidePanel } from "../shared/extension";
import { handleNoteStorageMessage } from "../shared/storage";

chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id && chrome.sidePanel?.open) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  (async () => {
    try {
      const handledStorageRequest = await handleNoteStorageMessage(message, sendResponse);
      if (handledStorageRequest) {
        notifySidePanel('DATA_CHANGED', {});
      }
    } catch (error) {
      sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  })();

  return true;
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log("Switched tab. New URL:", tab.url);
    
    notifySidePanel('TAB_CHANGED', { url: tab.url });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log(`Tab ${tabId} updated URL to:`, changeInfo.url);
  }
  notifySidePanel('TAB_CHANGED', { url: changeInfo.url });
  
});

