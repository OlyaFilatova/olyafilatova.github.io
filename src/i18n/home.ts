import type { Localization } from "./config";

export const texts = {
  "welcome": {
    "ua": "Вітаю! Я - Оля Філатова. Домашня сторінка знаходиться у стадії розробки.",
    "en": "Welcome! I'm Olha Filatova. The home page is under development."
  }
} as const satisfies Localization;
