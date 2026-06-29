import type { Localization } from "./config";

export const texts = {
  "page_title": {
    "uk": "Домашня сторінка - Ольга Філатова",
    "en": "Home page - Olha Filatova"
  },
  "name": {
    "uk": "Ольга Філатова",
    "en": "Olha Filatova"
  },
  "specialization": {
    "uk": "Backend-інженер із сильними навичками Node.js та Python. Спеціалізуюсь на API, серверних системах і автоматизації процесів.",
    "en": "Backend engineer with strong Node.js and Python experience, focused on APIs, systems, and automation."
  },
  "job_status": {
    "uk": "Доступна для нових можливостей і відкрита до пропозицій.",
    "en": "Available for new opportunities and open to offers."
  },
  "location": {
    "uk": "Україна, Віддалена співпраця.",
    "en": "Ukraine-based, Remote-only."
  },
  "contacts": {
    "uk": "Контакти:",
    "en": "Get in touch:"
  },
  "work_hours": {
    "uk": "Години роботи: 12:00 - 21:00 (за Київським часом)",
    "en": "Work hours: 12:00 - 21:00 (Kyiv time)"
  },
  "contact_me": {
    "uk": "За наступними контактами є можливість зв’язатися зі мною, для обговорення проєкту, пропозиції співпраці, кар’єрної можливості чи щоб потеревенити про розробку програмного забезпечення.",
    "en": "Feel free to reach out if you have a project, collaboration, job opportunity or wish to chat about software engineering."
  }
} as const satisfies Localization;
