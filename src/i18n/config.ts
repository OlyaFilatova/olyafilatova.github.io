import { createContext } from "react";

export const languages = ['ua', 'en'] as const;

export type Language = typeof languages[number];

function isLanguage(lang: string | null): lang is Language {
  return !!lang && languages.includes(lang as any);
}

function parseLangCache(): Language {
  const storedLanguage = localStorage.getItem('lang');
  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }
  return 'ua';
}

export const LanguageContext = createContext<Language>('ua');

const languageControls = (function(){
  let currentLanguage: Language = parseLangCache();
  return {
    getCurrentLanguage: function getCurrentLanguage() {
      return currentLanguage;
    },
    changeCurrentLanguage: function changeCurrentLanguage(lang: Language) {
      currentLanguage = lang;
      localStorage.setItem('lang', currentLanguage);
    }
  }
})();

export const getCurrentLanguage = languageControls.getCurrentLanguage;
export const changeCurrentLanguage = languageControls.changeCurrentLanguage;
