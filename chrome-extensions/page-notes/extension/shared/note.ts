export interface Note {
  id: string;
  note_en: string;
  note_uk?: string | null;
  url: string;
  uk_approved: boolean;
  visible: boolean;
  // createdAt: Date;
  // updatedAt: Date;
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

type LinksStatus = 'DONE' | 'PLANNED' | 'CANCELLED'

export type Link = [LinksStatus, string]

export interface Issue {
  url: string;
  links: Array<Link>;
}
