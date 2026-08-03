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
  "history": {
    "uk": "Хронологія досвіду",
    "en": "Experience Chronology"
  },
} as const satisfies Localization;
