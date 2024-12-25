import React from 'react';
    import { useTheme } from '../contexts/ThemeContext';
    import './ThemeToggle.css';

    function ThemeToggle() {
      const { theme, toggleTheme } = useTheme();

      return (
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === 'dark' ? 'Blue Sky' : 'Dark Mode'}
        </button>
      );
    }

    export default ThemeToggle;
