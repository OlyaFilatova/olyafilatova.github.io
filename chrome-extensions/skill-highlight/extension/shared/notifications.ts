import { JobListPageOpenedMessage, JobPageOpenedMessage, SkillEditTriggeredMessage, SkillSaveTriggeredMessage, SynonymAddTriggeredMessage, SynonymRemoveTriggeredMessage } from "./types";

export function notifyJobPageOpened(message: Omit<JobPageOpenedMessage, "type">): void {
  const type = "JOB_PAGE_OPENED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies JobPageOpenedMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}

export function notifyJobListPageOpened(message: Omit<JobListPageOpenedMessage, "type">): void {
  const type = "JOB_LIST_PAGE_OPENED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies JobListPageOpenedMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}

export function notifySkillSaveTriggered(message: Omit<SkillSaveTriggeredMessage, "type">): void {
  const type = "SKILL_SAVE_TRIGGERED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies SkillSaveTriggeredMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}

export function notifySkillEditTriggered(message: Omit<SkillEditTriggeredMessage, "type">): void {
  const type = "SKILL_EDIT_TRIGGERED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies SkillEditTriggeredMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}

export function notifyAddSynonymTriggered(message: Omit<SynonymAddTriggeredMessage, "type">): void {
  const type = "SYNONYM_ADD_TRIGGERED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies SynonymAddTriggeredMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}

export function notifyRemoveSynonymTriggered(message: Omit<SynonymRemoveTriggeredMessage, "type">): void {
  const type = "SYNONYM_REMOVE_TRIGGERED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies SynonymRemoveTriggeredMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}
