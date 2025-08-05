import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enLogin from './locales/en/login.json';
import enRegister from './locales/en/register.json';
import enForgotPassword from './locales/en/forgot-password.json';
import plLogin from './locales/pl/login.json';
import plRegister from './locales/pl/register.json';
import plForgotPassword from './locales/pl/forgot-password.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          ...enLogin,
          ...enRegister,
          ...enForgotPassword,
        }
      },
      pl: {
        translation: {
          ...plLogin,
          ...plRegister,
          ...plForgotPassword
        }
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
