export interface Note {
  id: string;
  text: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExtensionMessage =
  | { type: "NOTE_CREATED"; note: Note }
  | { type: "NOTES_CHANGED" }
  | { type: "NOTES_REMOVED"; normalizedTexts: string[] }
  | { type: "RELOAD_HIGHLIGHTS" }
  | { type: "OPEN_NOTE"; normalizedText: string };

export interface PageContext {
  url: string;
  body: HTMLElement | null;
}

export interface PageAggregate {
  url: string;
  notes: Note[];
  lastUpdatedAt: Date;
}

export interface NoteStorage {
  notes: Note[];
  mappingsByUrl: Record<string, PageAggregate>;
}
