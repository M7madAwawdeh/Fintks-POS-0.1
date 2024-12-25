import React, { createContext, useState, useContext, useEffect } from 'react';
    import localforage from 'localforage';

    const ThemeContext = createContext();

    export function ThemeProvider({ children }) {
      const [theme, setTheme] = useState('dark');

      useEffect(() => {
        const loadTheme = async () => {
          try {
            const storedTheme = await localforage.getItem('theme');
            if (storedTheme) {
              setTheme(storedTheme);
              applyTheme(storedTheme);
            }
          } catch (error) {
            console.error('Error loading theme from storage:', error);
          }
        };
        loadTheme();
      }, []);

      const applyTheme = (theme) => {
        document.body.classList.remove('light', 'dark', 'blue-sky');
        document.body.classList.add(theme);
      };

      const toggleTheme = async () => {
        let newTheme;
        if (theme === 'dark') {
          newTheme = 'blue-sky';
        } else {
          newTheme = 'dark';
        }
        setTheme(newTheme);
        applyTheme(newTheme);
        await localforage.setItem('theme', newTheme);
      };

      const value = {
        theme,
        toggleTheme,
      };

      return (
        <ThemeContext.Provider value={value}>
          {children}
        </ThemeContext.Provider>
      );
    }

    export function useTheme() {
      return useContext(ThemeContext);
    }
