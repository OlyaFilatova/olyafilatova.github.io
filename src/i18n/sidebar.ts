import type { Localization } from "./config";
import cv_en from '../assets/CV - Software Engineer - Olha Filatova.pdf';
import cv_ua from '../assets/CV - Software Engineer - Ольга Філатова.pdf';

export const texts = {
  "download_cv": {
    "ua": "Скачати CV",
    "en": "Download CV"
  },
  "cv_link": {
    "ua": cv_ua,
    "en": cv_en
  },
} as const satisfies Localization;
