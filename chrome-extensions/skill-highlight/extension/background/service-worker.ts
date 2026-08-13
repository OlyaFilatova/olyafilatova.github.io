import { URLS } from "../shared/config";
import { handleSkillStorageMessage } from "../shared/storage";
import { ContentMessage, JobListPageOpenedMessage, JobPageOpenedMessage, ServiceWorkerMessage, ServiceWorkerMessageType, SkillEditTriggeredMessage, SkillIgnoreTriggeredMessage, SkillOpenTriggeredMessage, SkillSaveTriggeredMessage } from "../shared/types";

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
  message: ServiceWorkerMessage,
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

  const eventListeners: Record<ServiceWorkerMessageType, (sender: any, message: any) => void> = {
    JOB_PAGE_OPENED: (sender, { type, ...message }: JobPageOpenedMessage) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'getJobPostingSkills',
        args: [
          message
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
    },
    JOB_LIST_PAGE_OPENED: (sender, message: JobListPageOpenedMessage) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'getVisitedLinks',
        args: [message.links]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            "type": "VISITED_LINKS_PARSED",
            "links": response.result as string[]
          });
        } else {
          console.log('error', response)
        }
      })
    },
    SKILL_SAVE_TRIGGERED: (sender, { type, ...message }: SkillSaveTriggeredMessage) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'createSkill',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            ...(response.result as any),
            "type": "SKILL_SAVED",
          });
          const filteroutTabs = sender.tab?.id ? [sender.tab?.id] : [];
          // const filterOutTabs = []
          void broadcastMessage(filterOutTabs, URLS, {
            "type": "RELOAD_HIGHLIGHTS"
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
    SKILL_EDIT_TRIGGERED: (sender, { type, ...message }: SkillEditTriggeredMessage) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'editSkill',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            "type": "SKILL_EDITED",
            ...message
          });
          const filteroutTabs = sender.tab?.id ? [sender.tab?.id] : [];
          void broadcastMessage(filteroutTabs, URLS, {
            "type": "RELOAD_HIGHLIGHTS"
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
    SKILL_IGNORE_TRIGGERED: (sender, { type, ...message }: SkillIgnoreTriggeredMessage) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'ignoreSkill',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            "type": "SKILL_IGNORED",
            ...message
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
    SKILL_OPEN_TRIGGERED: (sender, message: SkillOpenTriggeredMessage) => {
      const path = `side_panel/index.html?normalizedText=${encodeURIComponent(message.normalizedText)}`;
      if (typeof chrome.sidePanel.setOptions === "function") {
        void chrome.sidePanel.setOptions({ tabId: message.tabId, path, enabled: true });
      }
    },
  };

  if (message.type in eventListeners) {
    eventListeners[message.type](sender, message);
  }
});

function isExtensionMessage(
  message: unknown
): message is ContentMessage | ServiceWorkerMessage {
  return Boolean(
    message &&
    typeof message === "object" &&
    "type" in message
  );
}

export async function broadcastMessage(
  filterOutTabs: number[],
  urlPatterns: string[],
  message: ContentMessage): Promise<void> {
  const tabs = (await Promise.all(urlPatterns.map(url => chrome.tabs.query({ url })))).flat();
  await Promise.allSettled(
    tabs
      .filter((tab): tab is chrome.tabs.Tab & { id: number } => typeof tab.id === "number")
      .filter((tab) => !filterOutTabs.includes(tab.id))
      .map((tab) => chrome.tabs.sendMessage(tab.id, message))
  );
}

