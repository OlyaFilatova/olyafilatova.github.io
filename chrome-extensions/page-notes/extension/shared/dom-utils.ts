import type { PageContext } from "./note";

export function getCurrentPageContext(): PageContext {
  return {
    url: window.location.href,
    body: document.querySelector<HTMLElement>("body")
  };
}

export function selectionIsInside(selection: Selection, root: HTMLElement): boolean {
  if (selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  return root.contains(range.commonAncestorContainer);
}

