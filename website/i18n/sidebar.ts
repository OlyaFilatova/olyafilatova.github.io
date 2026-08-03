import type { Localization } from "./config";
import cv_en from '../assets/CV - Software Engineer - Olha Filatova.pdf';
import cv_ua from '../assets/CV - Software Engineer - Ольга Філатова.pdf';

export const texts = {
  "download_cv": {
    "uk": "Скачати CV",
    "en": "Download CV"
  },
  "cv_link": {
    "uk": cv_ua,
    "en": cv_en
  },
  "language_selector": {
    "uk": "Перемикач мови",
    "en": "Language selector"
  },
} as const satisfies Localization;
