import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, TrendingUp, Filter } from 'lucide-react';
import { getCompetitions } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

function Competitions() {
  const { t } = useLanguage();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getCompetitions();
        setCompetitions(result.data || []);
      } catch (err) {
        setError(t('error.server'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const filtered = competitions.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'league') return c.type === 'LEAGUE';
    if (filter === 'cup') return c.type === 'CUP';
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-ink-900 dark:text-white mb-2 tracking-tight">
          {t('nav.competitions')}
        </h1>
        <p className="text-ink-500 dark:text-ink-400">
          {competitions.length} {t('nav.competitions')}
        </p>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          {t('common.all')} ({competitions.length})
        </FilterButton>
        <FilterButton active={filter === 'league'} onClick={() => setFilter('league')}>
          {t('common.leagues')} ({competitions.filter(c => c.type === 'LEAGUE').length})
        </FilterButton>
        <FilterButton active={filter === 'cup'} onClick={() => setFilter('cup')}>
          {t('common.cups')} ({competitions.filter(c => c.type === 'CUP').length})
        </FilterButton>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((competition) => (
          <CompetitionCard key={competition.id} competition={competition} />
        ))}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
          : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800 border border-ink-200/60 dark:border-ink-800'
      }`}
    >
      {children}
    </button>
  );
}

function CompetitionCard({ competition }) {
  const code = competition.code || competition.id;
  const teamsCount = competition._count?.teams || 0;
  const matchesCount = competition._count?.matches || 0;

  return (
    <Link
      to={`/competitions/${code}`}
      className="group block bg-white dark:bg-ink-900 rounded-xl border border-ink-200/60 dark:border-ink-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-card hover:shadow-card-hover dark:shadow-dark-card dark:hover:shadow-dark-hover transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between mb-4">
        {competition.emblem ? (
          <img
            src={competition.emblem}
            alt={competition.name}
            className="w-14 h-14 object-contain"
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <Trophy size={22} className="text-ink-400" />
          </div>
        )}
        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 tracking-wider">
          {code}
        </span>
      </div>

      <h3 className="font-bold text-base text-ink-900 dark:text-white mb-1.5 line-clamp-2 min-h-[3rem] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {competition.name}
      </h3>

      <p className="text-sm text-ink-500 dark:text-ink-500 mb-4">
        {competition.country}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-ink-100 dark:border-ink-800">
        <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-ink-500">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {teamsCount}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp size={12} />
            {matchesCount}
          </span>
        </div>
        <span className="text-xs font-semibold text-ink-700 dark:text-ink-300">
          {competition.currentSeason}
        </span>
      </div>
    </Link>
  );
}

export default Competitions;