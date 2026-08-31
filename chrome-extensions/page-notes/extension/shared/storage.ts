import type {
  PageAggregate,
  Issue
} from "./note";

const STORAGE_REQUEST_TYPE = "NOTE_STORAGE_REQUEST";
const STORAGE_REQUEST_RETRY_COUNT = 2;
const STORAGE_REQUEST_RETRY_DELAY_MS = 100;

const ISSUE_BASE = 'issue';
const NOTE_BASE = 'note';

export interface NoteRepository {
  export(): Promise<Record<string, PageAggregate>>;
  getAggregates(): Promise<Record<string, PageAggregate>>;
  createNote(url: string, note: string): Promise<string>;
  editNote(id: string, note: string): Promise<void>;
  deleteNote(id: string): Promise<void>;
  clearNotes(): Promise<void>;

  addIssue(url: string): Promise<void>;
  refreshIssue(url: string): Promise<void>;
  deleteIssue(url: string): Promise<void>;
  getIssues(): Promise<Array<Issue>>
}

type StorageMethod = keyof NoteRepository;
type StorageRequest = {
  type: typeof STORAGE_REQUEST_TYPE;
  method: StorageMethod;
  args: unknown[];
};
type StorageResponse<T = unknown> = { ok: true; result: T } | { ok: false; error: string };

export class APINoteRepository implements NoteRepository {
  async export(): Promise<Record<string, PageAggregate>> {
    const response = await fetch(`${API_URL}/api/${NOTE_BASE}/note`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    return (await response.json())["pages"];
  }

  async getAggregates(): Promise<Record<string, PageAggregate>> {
    const response = await fetch(`${API_URL}/api/${NOTE_BASE}/note`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    return (await response.json())["pages"];
  }

  async createNote(url: string, note: string): Promise<string> {
    const result = await fetch(`${API_URL}/api/${NOTE_BASE}/note`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        note_en: note
      })
    });
    const id = (await result.json()).id;
    return id;
  }

  async editNote(id: string, note: string): Promise<void> {
    await fetch(`${API_URL}/api/${NOTE_BASE}/note`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        note_en: note
      })
    });
  }

  async translateNote(id: string, note: string): Promise<void> {
    await fetch(`${API_URL}/api/${NOTE_BASE}/note/uk`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        note_uk: note
      })
    });
  }

  async deleteNote(id: string): Promise<void> {
    await fetch(`${API_URL}/api/${NOTE_BASE}/note`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id
      })
    });
  }

  async clearNotes(): Promise<void> {
    await fetch(`${API_URL}/api/${NOTE_BASE}/note/all`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });
  }

  async addIssue(url: string): Promise<void> {
    await fetch(`${API_URL}/api/${ISSUE_BASE}/issue`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url
      })
    });
  }

  async refreshIssue(url: string): Promise<void> {
    await fetch(`${API_URL}/api/${ISSUE_BASE}/issue`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url
      })
    });
  }

  async deleteIssue(url: string): Promise<void> {
    await fetch(`${API_URL}/api/${ISSUE_BASE}/issue`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url
      })
    });
  }

  async getIssues(): Promise<Array<Issue>> {
    const response = await fetch(`${API_URL}/api/${ISSUE_BASE}/issue`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    return (await response.json())["issues"];
  }
}

export const extensionNoteRepository = new APINoteRepository();

export async function handleNoteStorageMessage(
  message: unknown,
  sendResponse: (response: StorageResponse) => void
): Promise<boolean> {
  if (!isStorageRequest(message)) {
    return false;
  }

  await invokeStorageMethod(message)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: getErrorMessage(error) }));

  return true;
}

class RuntimeNoteRepository implements NoteRepository {
  createNote(url: string, note: string): Promise<string> {
    return sendStorageRequest("createNote", url, note);
  }

  editNote(id: string, note: string): Promise<void> {
    return sendStorageRequest("editNote", id, note);
  }

  deleteNote(id: string): Promise<void> {
    return sendStorageRequest("deleteNote", id);
  }

  clearNotes(): Promise<void> {
    return sendStorageRequest("clearNotes");
  }

  export(): Promise<Record<string, PageAggregate>> {
    return sendStorageRequest("export");
  }

  getAggregates(): Promise<Record<string, PageAggregate>> {
    return sendStorageRequest("getAggregates");
  }

  addIssue(url: string): Promise<void> {
    return sendStorageRequest("addIssue", url);
  }

  refreshIssue(id: string): Promise<void> {
    return sendStorageRequest("refreshIssue", id);
  }

  deleteIssue(id: string): Promise<void> {
    return sendStorageRequest("deleteIssue", id);
  }

  getIssues(): Promise<Array<Issue>> {
    return sendStorageRequest("getIssues");
  }
}

export const noteRepository: NoteRepository = shouldUseRuntimeRepository()
  ? new RuntimeNoteRepository()
  : extensionNoteRepository;

async function sendStorageRequest<T>(method: StorageMethod, ...args: unknown[]): Promise<T> {
  return sendRawStorageRequest(method, ...args);
}

async function sendRawStorageRequest<T>(method: StorageMethod, ...args: unknown[]): Promise<T> {
  const request = { type: STORAGE_REQUEST_TYPE, method, args } satisfies StorageRequest;
  let lastError: unknown;

  for (let attempt = 0; attempt <= STORAGE_REQUEST_RETRY_COUNT; attempt += 1) {
    try {
      const response = await chrome.runtime.sendMessage(request) as StorageResponse<T> | undefined;

      if (!response) {
        throw new Error("Note storage request did not receive a response.");
      }

      if (!response.ok) {
        throw new Error(response.error);
      }

      return response.result;
    } catch (error) {
      lastError = error;
      if (!shouldRetryStorageRequest(error) || attempt === STORAGE_REQUEST_RETRY_COUNT) {
        break;
      }
      await delay(STORAGE_REQUEST_RETRY_DELAY_MS * (attempt + 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function invokeStorageMethod(message: StorageRequest): Promise<unknown> {
  throw new Error('invokeStorageMethod has been removed.')
}

function shouldUseRuntimeRepository(): boolean {
  if (!globalThis.location || !chrome.runtime?.getURL) {
    return false;
  }

  return globalThis.location.origin !== new URL(chrome.runtime.getURL("")).origin;
}

function isStorageRequest(message: unknown): message is StorageRequest {
  if (!message || typeof message !== "object") {
    return false;
  }

  const request = message as Partial<StorageRequest>;
  return request.type === STORAGE_REQUEST_TYPE && typeof request.method === "string" && Array.isArray(request.args);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function shouldRetryStorageRequest(error: unknown): boolean {
  const message = getErrorMessage(error);
  return (
    message.includes("message channel closed before a response was received") ||
    message.includes("The message port closed before a response was received") ||
    message.includes("Receiving end does not exist")
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}
