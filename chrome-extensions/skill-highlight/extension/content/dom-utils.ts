const HIGHLIGHT_SELECTOR = ".skill-highlight";

export function getTextNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim()) {
        return NodeFilter.FILTER_REJECT;
      }

      const parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }

      if (
        parent.closest(
          [
            HIGHLIGHT_SELECTOR,
            ".skill-popover",
            ".save-skill-button",
            "script",
            "style",
            "textarea",
            "input",
            "select",
            "button"
          ].join(",")
        )
      ) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  return nodes;
}

export function unwrapElements(root: HTMLElement, selector: string): void {
  root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    unwrapElement(element);
  });
}

export function unwrapHighlights(root: HTMLElement): void {
  unwrapElements(root, HIGHLIGHT_SELECTOR);
}

function unwrapElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) {
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
  parent.normalize();
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delayMs: number): T {
  let timeoutId: number | undefined;

  return ((...args: Parameters<T>) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delayMs);
  }) as T;
}

export function selectionIsInside(selection: Selection, root: HTMLElement): boolean {
  if (selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  return root.contains(range.commonAncestorContainer);
}
