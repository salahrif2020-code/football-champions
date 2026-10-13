import { useLanguage } from '../i18n/LanguageContext';

function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg transition-all border border-white/20 text-sm font-medium"
      title={language === 'ar' ? 'Switch to French' : 'التبديل للعربية'}
    >
      <span className="text-lg">{language === 'ar' ? '🇫🇷' : '🇲🇦'}</span>
      <span className="hidden sm:inline">
        {language === 'ar' ? 'Français' : 'العربية'}
      </span>
    </button>
  );
}

export default LanguageSwitcher;