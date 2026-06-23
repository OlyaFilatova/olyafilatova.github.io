import type { Localization } from "./config";

export const texts = {
  "name": {
    "ua": "Ольга Філатова",
    "en": "Olha Filatova"
  },
  "specialization": {
    "ua": "Backend-інженер із сильними навичками Node.js та Python. Спеціалізуюсь на API, серверних системах і автоматизації процесів.",
    "en": "Backend engineer with strong Node.js and Python experience, focused on APIs, systems, and automation."
  },
  "job_status": {
    "ua": "Доступна для нових можливостей і відкрита до пропозицій.",
    "en": "Available for new opportunities and open to offers."
  },
  "location": {
    "ua": "Україна, Віддалена співпраця.",
    "en": "Ukraine-based, Remote-only."
  },
  "contacts": {
    "ua": "Контакти:",
    "en": "Get in touch:"
  },
  "work_hours": {
    "ua": "Години роботи: 12:00 - 21:00 (за Київським часом)",
    "en": "Work hours: 12:00 - 21:00 (Kyiv time)"
  },
  "contact_me": {
    "ua": "За наступними контактами є можливість зв’язатися зі мною, для обговорення проєкту, пропозиції співпраці чи кар’єрної можливості.",
    "en": "Feel free to reach out if you have a project, collaboration, or job opportunity."
  }
} as const satisfies Localization;
