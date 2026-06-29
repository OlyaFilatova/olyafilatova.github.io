import type { Localization } from "./config";

export const texts_navigation = {
  "main": {
    "uk": "Головна",
    "en": "Home"
  },
  "books": {
    "uk": "Думки о джерелах знань",
    "en": "Thoughts on knowledge sources"
  },
  "history": {
    "uk": "Хронологія досвіду",
    "en": "Experience Chronology"
  },
} as const satisfies Localization;
