import { notifySidePanel } from "./extension";
import type {
  Note,
  PageAggregate,
  NoteStorage
} from "./note";

const DB_NAME = "page-notes";
const DB_VERSION = 1;
const NOTE_STORE = "pages";
const STORAGE_REQUEST_TYPE = "NOTE_STORAGE_REQUEST";
const STORAGE_REQUEST_RETRY_COUNT = 2;
const STORAGE_REQUEST_RETRY_DELAY_MS = 100;

export interface CreateNoteInput {
  text: string;
  url: string;
}

export interface NoteRepository {
  getAllNotes(): Promise<Note[]>;
  getAggregates(): Promise<Record<string, PageAggregate>>;
  getStorage(): Promise<NoteStorage>;
  createNote(input: CreateNoteInput): Promise<{ note: Note; created: boolean; reason?: string }>;
  deleteNote(note: Note): Promise<void>;
  clearNotes(): Promise<void>;
}

type StorageMethod = keyof NoteRepository;
type StorageRequest = {
  type: typeof STORAGE_REQUEST_TYPE;
  method: StorageMethod;
  args: unknown[];
};
type StorageResponse<T = unknown> = { ok: true; result: T } | { ok: false; error: string };

export class ChromeNoteRepository implements NoteRepository {
  private databasePromise: Promise<IDBDatabase> | null = null;

  async getAllNotes(): Promise<Note[]> {
    const storage = await this.getStorage();
    return [...storage.notes];
  }

  async getAggregates(): Promise<Record<string, PageAggregate>> {
    const storage = await this.getStorage();
    return {...storage.mappingsByUrl};
  }

  async getStorage(): Promise<NoteStorage> {
    return this.readIndexedDbStorage();
  }

  async createNote(input: CreateNoteInput): Promise<{ note: Note; created: boolean; reason?: string }> {
    const storage = await this.getStorage();
    const note = normalizeMainNote(input);

    storage.notes.unshift(note);
    if (!(note.url in storage.mappingsByUrl)) {
      storage.mappingsByUrl[note.url] = {
        url: note.url,
        notes: [],
        lastUpdatedAt: note.updatedAt
      };
    }
    storage.mappingsByUrl[note.url].notes.unshift(note);
    await this.saveStorage(storage);
    return { note, created: true }
  }

  async deleteNote(note: Note): Promise<void> {
    const storage = await this.getStorage();

    const noteIdx = storage.notes.findIndex(n => n.id == note.id);
    const page = storage.mappingsByUrl[note.url];
    const pageNoteIdx = page?.notes.findIndex(n => n.id == note.id);
    if (noteIdx === -1 && (!page || pageNoteIdx === -1)) {
      return;
    }

    if (noteIdx !== -1) {
      delete storage.notes[noteIdx];
    }

    if (pageNoteIdx !== -1) {
      delete page.notes[pageNoteIdx];
    }

    await this.saveStorage(storage);
  }

  async clearNotes(): Promise<void> {
    await this.getStorage();
    await this.saveStorage({
      notes: [],
      mappingsByUrl: {}
    });
  }

  private async saveStorage(storage: NoteStorage): Promise<void> {
    await this.writeIndexedDbStorage(storage);
  }

  private async readIndexedDbStorage(): Promise<NoteStorage> {
    const database = await this.getDatabase();
    const transaction = database.transaction([NOTE_STORE], "readonly");
    const noteStore = transaction.objectStore(NOTE_STORE);
    const done = transactionToPromise(transaction);
    const [notes] = await Promise.all([
      requestToPromise<Note[]>(noteStore.getAll())
    ]);
    await done;

    const sortedNotes = notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    return {
      notes: sortedNotes,
      mappingsByUrl: sortedNotes.reduce((aggregates: Record<string, PageAggregate>, note) => {
        if (!(note.url in aggregates)) {
          aggregates[note.url] = {
            url: note.url,
            notes: [],
            lastUpdatedAt: note.updatedAt
          }
        }

        aggregates[note.url].notes.push(note);

        return aggregates
      }, {})
    };
  }

  private async writeIndexedDbStorage(storage: NoteStorage): Promise<void> {
    const database = await this.getDatabase();
    const transaction = database.transaction([NOTE_STORE], "readwrite");
    const noteStore = transaction.objectStore(NOTE_STORE);
    const done = transactionToPromise(transaction);
    const requests: Array<Promise<unknown>> = [
      requestToPromise(noteStore.clear()),
    ];

    for (const note of storage.notes) {
      if (note) {
        requests.push(requestToPromise(noteStore.put(recordForNoteStore(noteStore, note))));
      }
    }

    await Promise.all(requests);
    await done;
  }

  private async getDatabase(): Promise<IDBDatabase> {
    this.databasePromise ??= openDatabase();
    return this.databasePromise;
  }
}

export const extensionNoteRepository = new ChromeNoteRepository();

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
  getAllNotes(): Promise<Note[]> {
    return sendStorageRequest("getAllNotes");
  }

  getStorage(): Promise<NoteStorage> {
    return sendStorageRequest("getStorage");
  }

  createNote(input: CreateNoteInput): Promise<{ note: Note; created: boolean; reason?: string }> {
    return sendStorageRequest("createNote", input);
  }

  deleteNote(note: Note): Promise<void> {
    return sendStorageRequest("deleteNote", note);
  }

  clearNotes(): Promise<void> {
    return sendStorageRequest("clearNotes");
  }

  getAggregates(): Promise<Record<string, PageAggregate>> {
    return sendStorageRequest("getAggregates");
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

async function invokeStorageMethod(message: StorageRequest): Promise<unknown> {
  switch (message.method) {
    case "getAllNotes":
      return extensionNoteRepository.getAllNotes();
    case "getStorage":
      return extensionNoteRepository.getStorage();
    case "createNote":
      return extensionNoteRepository.createNote(message.args[0] as CreateNoteInput);
    case "deleteNote":
      return extensionNoteRepository.deleteNote(message.args[0] as Note);
    case "clearNotes":
      return extensionNoteRepository.clearNotes();
    case "getAggregates":
      return extensionNoteRepository.getAggregates();
  }
}

function normalizeMainNote(note: Partial<Note>): Note {
  return {
    id: note.id || crypto.randomUUID(),
    text: note.text?.trim() || '',
    url: note.url!,
    createdAt: toDate(note.createdAt) ?? new Date(),
    updatedAt: toDate(note.updatedAt) ?? new Date()
  };
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
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

function recordForNoteStore(noteStore: IDBObjectStore, note: Note): Note {
  return noteStore.keyPath === "id" ? { ...note, id: note.id || crypto.randomUUID() } : note;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(NOTE_STORE)) {
        const store = database.createObjectStore(NOTE_STORE, { keyPath: "id" });
        store.createIndex?.("id", "id", { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open notes database."));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
  });
}

