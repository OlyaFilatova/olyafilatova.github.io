import type { Status } from "../schemas/knowledge-source";
import type { Localization } from "./config";

export const texts = {
  "welcome": {
    "ua": "Вітаю! Сторінка про джерела знань знаходиться у стадії розробки.",
    "en": "Welcome! The page about knowledge sources is under development."
  }
} as const satisfies Localization;

export const statusTextMapping: Record<Status, Record<string, string>> = {
  'not-started': {
    "ua": "Заплановано",
    "en": "Planned"
  },
  'in-progress-first-read': {
    "ua": "Читаю (перше читання)",
    "en": "In progress (first read)"
  },
  'first-read': {
    "ua": "Прочитала (перше читання)",
    "en": "Read (first read)"
  },
  'in-progress-thorough-read': {
    "ua": "Читаю (повторне читання)",
    "en": "In progress (thorough read)"
  },
  'read': {
    "ua": "Прочитала",
    "en": "Read"
  }
} as const satisfies Localization;
