//
//
//

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import "intl-pluralrules";
import * as enTranslations from "./locales/en.json";
import * as deTranslations from "./locales/de.json";

i18next
  .use(initReactI18next)
  //   .use(LanguageDetector)
  .init({
    lng: "en",
    // fallbackLng: "en",
    resources: {
      en: {
        translation: enTranslations,
      },
      de: {
        translation: deTranslations,
      },
    },
  });
export default i18next;
