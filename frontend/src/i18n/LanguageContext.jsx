import { createContext, useContext, useState, useEffect } from 'react';
import { translations, DEFAULT_LANGUAGE } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // اقرأ اللغة المحفوظة من localStorage
    return localStorage.getItem('language') || DEFAULT_LANGUAGE;
  });

  // عند تغيير اللغة:
  useEffect(() => {
    // 1. احفظها في localStorage
    localStorage.setItem('language', language);

    // 2. غيّر اتجاه الصفحة (RTL للعربية، LTR للفرنسية)
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // دالة الترجمة
  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  // دالة التبديل
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook للاستخدام في المكونات
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}