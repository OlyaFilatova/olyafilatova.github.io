import { ExtensionMessage } from "../shared/types";

export function notifyJobPageOpened(message: {
  body: string;
  category: string;
  company: string;
  url: string;
}): void {
  try {
    const result = chrome.runtime?.sendMessage?.({
      type: "JOB_PAGE_OPENED",
      ...message
    } satisfies ExtensionMessage);
    if (result && "catch" in result) {
      result.catch(reason => console.log(
        `JOB_PAGE_OPENED notification failed. Reason ${reason}`
      ));
    }
  } catch {
    // No runtime listeners may be available in tests or non-extension contexts.
  }
}
