import { JobListPageOpenedMessage, JobPageOpenedMessage, SkillEditTriggeredMessage, SkillIgnoreTriggeredMessage, SkillOpenTriggeredMessage, SkillSaveTriggeredMessage } from "../shared/types";

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

export function notifySkillIgnoreTriggered(message: Omit<SkillIgnoreTriggeredMessage, "type">): void {
  const type = "SKILL_IGNORE_TRIGGERED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies SkillIgnoreTriggeredMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}

export function notifySkillOpenTriggered(message: Omit<SkillOpenTriggeredMessage, "type">): void {
  const type = "SKILL_OPEN_TRIGGERED";
  const result = chrome.runtime?.sendMessage?.({
    type,
    ...message
  } satisfies SkillOpenTriggeredMessage);
  if (result && "catch" in result) {
    result.catch(reason => console.log(
      `${type} notification failed. Reason ${reason}`
    ));
  }
}
