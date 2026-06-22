import type { Localization } from "./config";

export const texts_navigation = {
  "main": {
    "ua": "Головна",
    "en": "Home"
  },
  "books": {
    "ua": "Думки о джерелах знань",
    "en": "Thoughts on knowledge sources"
  },
  "history": {
    "ua": "Хронологія досвіду",
    "en": "Experience Chronology"
  },
} as const satisfies Localization;
