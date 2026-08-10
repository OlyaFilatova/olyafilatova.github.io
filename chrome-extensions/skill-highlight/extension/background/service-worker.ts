import { URLS } from "../shared/config";
import { ExtensionMessage } from "../shared/types";
import { handleSkillStorageMessage } from "../shared/storage";

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

chrome.runtime.onMessage.addListener((
  message: unknown,
  sender,
  sendResponse
) => {
  try {
    const handledStorageRequest = handleSkillStorageMessage(
      message,
      sendResponse
    );
    if (handledStorageRequest) {
      return true;
    }
  } catch (error) {
    sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
    return true;
  }

  if (!isExtensionMessage(message)) {
    return undefined;
  }

  if (
    message.type === "JOB_PAGE_OPENED"
  ) {
    handleSkillStorageMessage({
      type: 'SKILL_STORAGE_REQUEST',
      method: 'getJobPostingSkills',
      args: [
        {
          url: message.url,
          body: message.body,
          category: message.category,
          company: message.company
        }
      ]
    }, response => {
      if (response.ok) {
        void broadcastMessage([], [message.url], {
          "type": "SKILLS_PARSED",
          "skills": response.result as any
        });
        sendResponse(response);
      } else {
        sendResponse(response);
      }
    })
  }
});


function isExtensionMessage(
  message: unknown
): message is ExtensionMessage {
  return Boolean(
    message &&
    typeof message === "object" &&
    "type" in message
  );
}

async function broadcastMessage(
  filterOutTabs: number[],
  urlPatterns: string[],
  message: any): Promise<void> {
  const tabs = (await Promise.all(urlPatterns.map(url => chrome.tabs.query({ url })))).flat();
  await Promise.allSettled(
    tabs
      .filter((tab): tab is chrome.tabs.Tab & { id: number } => typeof tab.id === "number")
      .filter((tab) => !filterOutTabs.includes(tab.id))
      .map((tab) => chrome.tabs.sendMessage(tab.id, message))
  );
}

