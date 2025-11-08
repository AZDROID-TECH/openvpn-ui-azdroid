import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationAZ from './locales/az/common.json';
import translationEN from './locales/en/common.json';

const resources = {
  en: {
    common: translationEN,
  },
  az: {
    common: translationAZ,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'az',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    defaultNS: 'common',
  });

export default i18n;