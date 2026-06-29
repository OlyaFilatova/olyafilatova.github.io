import type { Status } from "../schemas/knowledge-source";
import type { Localization } from "./config";

export const texts = {
  "page_title": {
    "uk": "Думки о джерелах знань - Ольга Філатова",
    "en": "Thoughts on knowledge sources - Olha Filatova"
  },
  "welcome": {
    "uk": "Вітаю! Сторінка про джерела знань знаходиться у стадії розробки.",
    "en": "Welcome! The page about knowledge sources is under development."
  }
} as const satisfies Localization;

export const statusTextMapping: Record<Status, Record<string, string>> = {
  'planned': {
    "uk": "Заплановано",
    "en": "Planned"
  },
  'in-progress-first-read': {
    "uk": "Читаю (перше читання)",
    "en": "In progress (first read)"
  },
  'first-read': {
    "uk": "Прочитала (перше читання)",
    "en": "Read (first read)"
  },
  'in-progress-thorough-read': {
    "uk": "Читаю (повторне читання)",
    "en": "In progress (thorough read)"
  },
  'read': {
    "uk": "Прочитала",
    "en": "Read"
  },
  'paused': {
    "uk": "Призупинено",
    "en": "Paused"
  }
} as const satisfies Localization;
