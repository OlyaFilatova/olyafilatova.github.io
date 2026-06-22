import type { Localization } from "./config";

export const texts = {
  "welcome": {
    "ua": "Вітаю! Сторінка про досвід знаходиться у стадії розробки.",
    "en": "Welcome! The page about experience is under development."
  }
} as const satisfies Localization;
