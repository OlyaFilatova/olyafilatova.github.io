export const texts = {
  "welcome": {
    "ua": "Вітаю! Я - Оля Філатова. Ця сторінка наразі знаходиться у стадії розробки.",
    "en": "Welcome! I'm Olha Filatova. This page is currently under development."
  }
} as const satisfies Record<string, {
  "ua": string;
  "en": string;
}>;
