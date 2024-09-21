import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./en/en.json";
import ruJSON from "./ru/ru.json";

const defaultLanguage = "ru";

const savedLanguage = localStorage.getItem("language") || defaultLanguage;

i18next.use(initReactI18next).init({
  lng: savedLanguage,
  debug: true,
  resources: {
    en: {
      translation: enJSON,
    },
    ru: {
      translation: ruJSON,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

i18next.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});
