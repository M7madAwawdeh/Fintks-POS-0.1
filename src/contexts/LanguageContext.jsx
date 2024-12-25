import React, { createContext, useState, useContext, useEffect } from 'react';
    import localforage from 'localforage';

    const LanguageContext = createContext();

    export function LanguageProvider({ children }) {
      const [language, setLanguage] = useState('en');

      useEffect(() => {
        const loadLanguage = async () => {
          try {
            const storedLanguage = await localforage.getItem('language');
            if (storedLanguage) {
              setLanguage(storedLanguage);
            }
          } catch (error) {
            console.error('Error loading language from storage:', error);
          }
        };
        loadLanguage();
      }, []);

      const setAppLanguage = async (lang) => {
        setLanguage(lang);
        await localforage.setItem('language', lang);
      };

      const value = {
        language,
        setLanguage: setAppLanguage,
      };

      return (
        <LanguageContext.Provider value={value}>
          {children}
        </LanguageContext.Provider>
      );
    }

    export function useLanguage() {
      return useContext(LanguageContext);
    }
