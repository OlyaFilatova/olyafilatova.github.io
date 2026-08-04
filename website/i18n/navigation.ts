import type { Localization } from "./config";

export const texts_navigation = {
  "main": {
    "uk": "Головна",
    "en": "Home"
  },
  "books": {
    "uk": "Нотатки о джерелах знань",
    "en": "Notes on knowledge sources"
  },
  "projects": {
    "uk": "Опис проєктів",
    "en": "Project descriptions"
  },
  "history": {
    "uk": "Хронологія досвіду",
    "en": "Experience Chronology"
  },
} as const satisfies Localization;
