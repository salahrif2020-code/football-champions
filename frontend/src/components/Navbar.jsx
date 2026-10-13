import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Globe, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl border-b border-ink-200/60 dark:border-ink-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:shadow-brand-600/50 transition-all">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-white"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20Z" />
                <path d="m2 12 10-4 10 4" />
                <path d="m12 2-4 10 4 10" />
                <path d="m12 2 4 10-4 10" />
              </svg>
            </div>
            <span className="font-bold text-lg text-ink-900 dark:text-white tracking-tight">
              Football Champions
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={isActive('/', true)} icon={<Home size={16} />}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/competitions" active={isActive('/competitions')} icon={<Trophy size={16} />}>
              {t('nav.competitions')}
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              title={language === 'ar' ? 'Français' : 'العربية'}
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{language === 'ar' ? 'FR' : 'AR'}</span>
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-ink-200/60 dark:border-ink-800 animate-fade-in">
            <div className="flex flex-col gap-1">
              <MobileNavLink to="/" active={isActive('/', true)} icon={<Home size={18} />} onClick={() => setMobileOpen(false)}>
                {t('nav.home')}
              </MobileNavLink>
              <MobileNavLink to="/competitions" active={isActive('/competitions')} icon={<Trophy size={18} />} onClick={() => setMobileOpen(false)}>
                {t('nav.competitions')}
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, active, icon, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
          : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-brand-600 text-white'
          : 'text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

export default Navbar;