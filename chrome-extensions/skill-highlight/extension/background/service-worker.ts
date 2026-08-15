/* eslint-disable @typescript-eslint/no-explicit-any */
import { URLS } from "../shared/config";
import { handleSkillStorageMessage } from "../shared/storage";
import { ContentMessage, JobListPageOpenedMessage, JobPageOpenedMessage, JobPostingResponse, ServiceWorkerMessage, ServiceWorkerMessageType, SkillEditTriggeredMessage, SkillSavedMessage, SkillSaveTriggeredMessage, SynonymAddTriggeredMessage, SynonymRemoveTriggeredMessage } from "../shared/types";

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

  const eventListeners: Record<ServiceWorkerMessageType, (sender: any, data: any) => void> = {
    JOB_PAGE_OPENED: (sender, message: JobPageOpenedMessage["message"]) => {
      const url = (() => {
        const url = new URL(message.url);
        url.search = '';
        return url.toString();
      })();

      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'getJobPostingSkills',
        args: [
          {
            ...message,
            url
          }
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            "type": "SKILLS_PARSED",
            message: {
              "skills": response.result as JobPostingResponse["skills"]
            }
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      })
    },
    JOB_LIST_PAGE_OPENED: (sender, message: JobListPageOpenedMessage["message"]) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'getVisitedLinks',
        args: [message.links]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            "type": "VISITED_LINKS_PARSED",
            message: {
              "links": response.result as string[]
            }
          });
        } else {
          console.log('error', response)
        }
      })
    },
    SKILL_SAVE_TRIGGERED: (sender, message: SkillSaveTriggeredMessage["message"]) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'createSkill',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], [message.url], {
            message: response.result as SkillSavedMessage["message"],
            type: "SKILL_SAVED",
          });
          const filteroutTabs = sender.tab?.id ? [sender.tab?.id] : [];
          void broadcastMessage(filteroutTabs, URLS, {
            type: "RELOAD_HIGHLIGHTS",
            message: undefined
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
    SKILL_EDIT_TRIGGERED: (sender, message: SkillEditTriggeredMessage["message"]) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'editSkill',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], message.url ? [message.url] : [], {
            type: "SKILL_EDITED",
            message
          });
          const filteroutTabs = sender.tab?.id ? [sender.tab?.id] : [];
          void broadcastMessage(filteroutTabs, URLS, {
            type: "RELOAD_HIGHLIGHTS",
            message: undefined
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
    SYNONYM_ADD_TRIGGERED: (sender, message: SynonymAddTriggeredMessage["message"]) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'addSynonym',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], URLS, {
            type: "SYNONYM_UPDATED",
            message: undefined
          });
          void broadcastToSidePanel({
            type: "SYNONYM_UPDATED",
            message: undefined
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
    SYNONYM_REMOVE_TRIGGERED: (sender, message: SynonymRemoveTriggeredMessage["message"]) => {
      handleSkillStorageMessage({
        type: 'SKILL_STORAGE_REQUEST',
        method: 'removeSynonym',
        args: [
          message
        ]
      }, response => {
        if (response.ok) {
          void broadcastMessage([], URLS, {
            type: "SYNONYM_UPDATED",
            message: undefined
          });
          void broadcastToSidePanel({
            type: "SYNONYM_UPDATED",
            message: undefined
          });
          sendResponse(response);
        } else {
          sendResponse(response);
        }
      });
    },
  };

  if (message.type in eventListeners) {
    eventListeners[message.type](sender, message.message);
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

export async function broadcastToSidePanel(message: ContentMessage) {
  chrome.runtime.sendMessage(message);
}
