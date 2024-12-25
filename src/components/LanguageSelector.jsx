import React, { useEffect } from 'react';
    import { useLanguage } from '../contexts/LanguageContext';
    import { useTranslation } from '../hooks/useTranslation';
    import { useAuth } from '../contexts/AuthContext';
    import ThemeToggle from './ThemeToggle';
    import './LanguageSelector.css';

    function LanguageSelector() {
      const { language, setLanguage } = useLanguage();
      const { t } = useTranslation();
      const { logout, currentUser } = useAuth();

      useEffect(() => {
        document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
      }, [language]);

      const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
      };

      const handleLogout = async () => {
        await logout();
      };

      return (
        <div className="language-selector">
          <div className="select-container">
            <label className="language-label">{t('language')}: </label>
            <select value={language} onChange={handleLanguageChange} className="language-select">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div className="actions-container">
            {currentUser && (
              <button onClick={handleLogout} className="logout-button">{t('logout')}</button>
            )}
            <ThemeToggle />
          </div>
        </div>
      );
    }

    export default LanguageSelector;
