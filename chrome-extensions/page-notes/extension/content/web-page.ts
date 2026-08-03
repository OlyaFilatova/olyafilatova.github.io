import { getCurrentPageContext, selectionIsInside } from "../shared/dom-utils";
import { noteRepository } from "../shared/storage"

let saveButton: HTMLButtonElement | null = null;
let popover: HTMLElement | null = null;
let pendingSelectionText = "";

void initPage();

async function initPage(): Promise<void> {
  const context = getCurrentPageContext();

  if (!context.body) {
    console.log('Page body not found')
    return;
  }

  createSaveButton();
  bindSelectionSave(context.body);
}

function createSaveButton(): void {
  saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "save-note-button";
  saveButton.textContent = "Save Note";
  saveButton.hidden = true;
  document.body.append(saveButton);

  saveButton.addEventListener("mousedown", (event) => event.preventDefault());
  saveButton.addEventListener("click", () => void saveSelectedNote());
}

function bindSelectionSave(descriptionEl: HTMLElement): void {
  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selectionIsInside(selection, descriptionEl)) {
      hideSaveButton();
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      hideSaveButton();
      return;
    }

    pendingSelectionText = selectedText;
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    showSaveButton(rect);
  });

  document.addEventListener("mousedown", (event) => {
    const target = event.target as Node | null;
    if (saveButton?.contains(target) || popover?.contains(target)) {
      return;
    }
    closePopover();
  });
}

async function saveSelectedNote(): Promise<void> {
  const context = getCurrentPageContext();
  if (!context.body || !pendingSelectionText) {
    return;
  }

  try {
    await noteRepository.createNote({
      text: pendingSelectionText,
      url: context.url
    });

    hideSaveButton();
    window.getSelection()?.removeAllRanges();
  } catch (error) {
    console.error("Page notes: failed to save selected text.", error);
    showTemporaryStatus("Could not save note");
  }
}

function showSaveButton(rect: DOMRect): void {
  if (!saveButton) {
    return;
  }

  saveButton.hidden = false;
  saveButton.style.left = `${Math.min(rect.left, window.innerWidth - 110)}px`;
  saveButton.style.top = `${Math.max(rect.top - 38, 8)}px`;
}

function hideSaveButton(): void {
  if (saveButton) {
    saveButton.hidden = true;
  }
}

function closePopover(): void {
  popover?.remove();
  popover = null;
}

function showTemporaryStatus(text: string): void {
  if (!saveButton) {
    return;
  }

  saveButton.textContent = text;
  saveButton.hidden = false;
  window.setTimeout(() => {
    if (saveButton) {
      saveButton.textContent = "Save Note";
      saveButton.hidden = true;
    }
  }, 1600);
}
