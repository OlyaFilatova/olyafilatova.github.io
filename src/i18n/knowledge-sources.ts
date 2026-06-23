import type { Localization } from "./config";

export const texts = {
  "welcome": {
    "ua": "Вітаю! Сторінка про джерела знань знаходиться у стадії розробки.",
    "en": "Welcome! The page about knowledge sources is under development."
  }
} as const satisfies Localization;
