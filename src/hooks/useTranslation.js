import { useLanguage } from '../contexts/LanguageContext';
    import en from '../i18n/en.json';
    import ar from '../i18n/ar.json';

    const translations = {
      en,
      ar,
    };

    export function useTranslation() {
      const { language } = useLanguage();

      const t = (key) => {
        if (!translations[language] || !translations[language][key]) {
          console.warn(`Translation for key "${key}" in language "${language}" not found.`);
          return key;
        }
        return translations[language][key];
      };

      return { t };
    }
