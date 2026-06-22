import type { Localization } from "./config";

export const texts_navigation = {
  "books": {
    "ua": "Думки о книгах",
    "en": "Thoughts on books"
  },
  "history": {
    "ua": "Хронологія досвіду",
    "en": "Experience Chronology"
  },
} as const satisfies Localization;
