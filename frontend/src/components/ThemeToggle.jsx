import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg transition-all border border-white/20 text-sm font-medium"
      title={theme === 'dark' ? 'وضع نهاري' : 'وضع ليلي'}
    >
      <span className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span className="hidden sm:inline">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

export default ThemeToggle;